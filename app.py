from flask import Flask, request, jsonify, render_template
from promptshield import analyze_prompt, add_red_flag, get_red_flags, get_llm_response  # your AI logic
from collections import defaultdict
import time
from datetime import datetime, timedelta

app = Flask(__name__)

# Enhanced in-memory stats with detailed tracking
stats = {
    'jedi': 0,   # PADAWAN
    'sith': 0,   # SITH INFILTRATOR or SITH LORD
    'total': 0,
    'detailed_logs': [],  # Store detailed analysis logs
    'hourly_stats': defaultdict(lambda: {'jedi': 0, 'sith': 0}),
    'risk_scores': [],    # Store risk scores for analysis
    'flag_triggers': defaultdict(int),  # Track which flags trigger most
    'llm_classifications': defaultdict(int),  # Track LLM classification patterns
    'session_stats': {   # Track per-session statistics
        'start_time': time.time(),
        'peak_threat_level': 0,
        'avg_risk_score': 0,
        'unique_attack_patterns': set()
    }
}

def log_analysis_result(prompt, result):
    """Log detailed analysis result for analytics"""
    timestamp = datetime.now()
    # Create detailed log entry
    log_entry = {
        'timestamp': timestamp.isoformat(),
        'prompt_length': len(prompt),
        'verdict': result['verdict'],
        'risk_score': result['score'],
        'llm_classification': result['llm_classification'],
        'matched_flags': result['matched_flags'],
        'hour': timestamp.hour,
        'date': timestamp.date().isoformat()
    }
    # Store log entry
    stats['detailed_logs'].append(log_entry)
    # Update hourly stats
    hour_key = f"{timestamp.date().isoformat()}_{timestamp.hour:02d}"
    if "PADAWAN" in result['verdict']:
        stats['hourly_stats'][hour_key]['jedi'] += 1
    else:
        stats['hourly_stats'][hour_key]['sith'] += 1
    # Update risk scores
    stats['risk_scores'].append(result['score'])
    # Track flag triggers
    for flag in result['matched_flags']:
        stats['flag_triggers'][flag] += 1
    # Track LLM classifications
    stats['llm_classifications'][result['llm_classification']] += 1
    # Update session stats
    stats['session_stats']['peak_threat_level'] = max(
        stats['session_stats']['peak_threat_level'], 
        result['score']
    )
    if stats['risk_scores']:
        stats['session_stats']['avg_risk_score'] = sum(stats['risk_scores']) / len(stats['risk_scores'])
    # Track unique attack patterns
    if result['matched_flags']:
        pattern = ','.join(sorted(result['matched_flags']))
        stats['session_stats']['unique_attack_patterns'].add(pattern)
    # Keep only last 1000 entries to prevent memory issues
    if len(stats['detailed_logs']) > 1000:
        stats['detailed_logs'] = stats['detailed_logs'][-1000:]
    # Clean old hourly stats (keep last 7 days)
    cutoff_date = (datetime.now() - timedelta(days=7)).date()
    old_keys = [k for k in stats['hourly_stats'].keys() if k.split('_')[0] < cutoff_date.isoformat()]
    for key in old_keys:
        del stats['hourly_stats'][key]

@app.route("/")
def home():
    return render_template("index.html")  # loads from /templates

@app.route("/analyze_prompt", methods=["POST"])
def analyze():
    try:
        data = request.get_json()
        prompt = data.get("prompt", "")
        result = analyze_prompt(prompt)
        # Update basic stats
        verdict = result.get("verdict", "")
        if "PADAWAN" in verdict:
            stats['jedi'] += 1
        else:
            stats['sith'] += 1
        stats['total'] += 1
        # Log detailed analysis
        log_analysis_result(prompt, result)
        return jsonify(result)
    except Exception as e:
        print("Error in /analyze_prompt:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/final_llm_response", methods=["POST"])
def final_llm_response():
    try:
        data = request.get_json()
        prompt = data.get("prompt", "")
        if not prompt:
            return jsonify({"error": "No prompt provided."}), 400
        response = get_llm_response(prompt)
        return jsonify({"llm_response": response})
    except Exception as e:
        print("Error in /final_llm_response:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/analysis")
def analysis():
    return render_template("analysis.html")

@app.route("/stats")
def get_stats():
    try:
        total = stats['total']
        jedi_pct = round(100 * stats['jedi'] / total, 2) if total > 0 else 0
        sith_pct = round(100 * stats['sith'] / total, 2) if total > 0 else 0
        # Timeline: last 10 hours threat level (mocked for now)
        now = datetime.now()
        timeline = []
        for i in range(10):
            hour = (now - timedelta(hours=9-i)).replace(minute=0, second=0, microsecond=0)
            hour_key = f"{hour.date().isoformat()}_{hour.hour:02d}"
            sith = stats['hourly_stats'][hour_key]['sith'] if hour_key in stats['hourly_stats'] else 0
            jedi = stats['hourly_stats'][hour_key]['jedi'] if hour_key in stats['hourly_stats'] else 0
            total_hour = sith + jedi
            threat = (sith / total_hour * 100) if total_hour > 0 else 0
            timeline.append(threat)
        # Get red flags (for insights)
        try:
            from promptshield import get_red_flags
            flags = get_red_flags()
        except Exception:
            flags = []
        # Detection rate (mocked)
        detection_rate = min(95, 70 + (stats['total'] * 0.5)) if stats['total'] > 0 else 0
        return jsonify({
            'jedi': stats['jedi'],
            'sith': stats['sith'],
            'total': stats['total'],
            'jedi_pct': jedi_pct,
            'sith_pct': sith_pct,
            'timeline': timeline,
            'flags': flags,
            'detection_rate': detection_rate
        })
    except Exception as e:
        print("Error in /stats:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/red_flags")
def red_flags():
    try:
        return jsonify(get_red_flags())
    except Exception as e:
        print("Error in /red_flags:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/add_red_flag", methods=["POST"])
def add_flag():
    try:
        data = request.get_json()
        flag = data.get("flag", "")
        if add_red_flag(flag):
            return jsonify({"success": True, "flag": flag})
        else:
            return jsonify({"success": False, "flag": flag, "reason": "Already exists or invalid"}), 400
    except Exception as e:
        print("Error in /add_red_flag:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
