import pandas as pd
import os
import matplotlib.pyplot as plt
import numpy as np
import re

FAKE_PATH = os.path.expanduser("~/Desktop/Us/fake_data/")
report_file = os.path.join(FAKE_PATH, "trend_report.txt")

user_stats = []
with open(report_file, encoding="utf-8") as f:
    lines = f.readlines()
    curr = {}
    for line in lines:
        if line.startswith("User "):
            if curr: user_stats.append(curr)
            curr = {"uid": line.strip().split()[1][:-1]}
        m = re.match(r".*Mood B.*slope=([-\d.]+), R=([-\d.]+)", line)
        if m: curr["Mood_B_slope"] = float(m.group(1)); curr["Mood_B_R"] = float(m.group(2))
        m = re.match(r".*Mood A.*slope=([-\d.]+), R=([-\d.]+)", line)
        if m: curr["Mood_A_slope"] = float(m.group(1)); curr["Mood_A_R"] = float(m.group(2))
        m = re.match(r".*Mood C.*slope=([-\d.]+), R=([-\d.]+)", line)
        if m: curr["Mood_C_slope"] = float(m.group(1)); curr["Mood_C_R"] = float(m.group(2))
        m = re.match(r".*Online time.*slope=([-\d.]+).*R=([-\d.]+)", line)
        if m: curr["Online_slope"] = float(m.group(1)); curr["Online_R"] = float(m.group(2))
        m = re.match(r".*Join Us.*slope=([-\d.]+), R=([-\d.]+)", line)
        if m: curr["Join_slope"] = float(m.group(1)); curr["Join_R"] = float(m.group(2))
        m = re.match(r".*React Post.*slope=([-\d.]+), R=([-\d.]+)", line)
        if m: curr["React_slope"] = float(m.group(1)); curr["React_R"] = float(m.group(2))
        m = re.match(r".*Comment Post.*slope=([-\d.]+), R=([-\d.]+)", line)
        if m: curr["Comment_slope"] = float(m.group(1)); curr["Comment_R"] = float(m.group(2))
        m = re.match(r".*Post Emotion.*slope=([-\d.]+), R=([-\d.]+)", line)
        if m: curr["Post_slope"] = float(m.group(1)); curr["Post_R"] = float(m.group(2))
    if curr: user_stats.append(curr)

uids = [u['uid'] for u in user_stats]
x = np.arange(len(uids))

plt.figure(figsize=(19, 5))

vals_b = np.array([u.get("Mood_B_slope", 0) for u in user_stats])
plt.subplot(1,4,1)
plt.bar(uids, vals_b, color="green", alpha=0.8)
plt.axhline(vals_b.mean(), color="red", linestyle="--", label=f"Mean={vals_b.mean():.2f}")
plt.title("Mood B (happy/driven)")
plt.ylabel("Slope")
for i, v in enumerate(vals_b):
    plt.text(i, v, f"{v:.2f}", ha='center', va='bottom' if v>0 else 'top', fontsize=10)
plt.legend()
plt.grid(axis='y', linestyle=':')

vals_a = np.array([u.get("Mood_A_slope", 0) for u in user_stats])
vals_c = np.array([u.get("Mood_C_slope", 0) for u in user_stats])
plt.subplot(1,4,2)
w = 0.35
plt.bar(x-w/2, vals_a, width=w, color="orange", label="A (sad/lonely)", alpha=0.7)
plt.bar(x+w/2, vals_c, width=w, color="blue", label="C (anxious/confused)", alpha=0.7)
plt.axhline(vals_a.mean(), color="orange", linestyle="--", label=f"A Mean={vals_a.mean():.2f}")
plt.axhline(vals_c.mean(), color="blue", linestyle="--", label=f"C Mean={vals_c.mean():.2f}")
plt.title("Mood A & C")
plt.ylabel("Slope")
plt.xticks(x, uids)
for i,(a,c) in enumerate(zip(vals_a, vals_c)):
    plt.text(i-w/2, a, f"{a:.2f}", ha='center', va='bottom' if a>0 else 'top', color="orange", fontsize=10)
    plt.text(i+w/2, c, f"{c:.2f}", ha='center', va='bottom' if c>0 else 'top', color="blue", fontsize=10)
plt.legend(fontsize=9)
plt.grid(axis='y', linestyle=':')

vals_online = np.array([u.get("Online_slope", 0) for u in user_stats])
plt.subplot(1,4,3)
plt.bar(uids, vals_online, color="purple", alpha=0.8)
plt.axhline(vals_online.mean(), color="red", linestyle="--", label=f"Mean={vals_online.mean():.2f}")
plt.title("Online Time")
plt.ylabel("Slope (min/day)")
for i, v in enumerate(vals_online):
    plt.text(i, v, f"{v:.2f}", ha='center', va='bottom' if v>0 else 'top', fontsize=10)
plt.legend()
plt.grid(axis='y', linestyle=':')

labels = ["Join", "React", "Comment", "Post"]
colors = ["#5bc0be", "#f8b400", "#6a89cc", "#ff6f61"]
slopes = [
    np.array([u.get("Join_slope", 0) for u in user_stats]),
    np.array([u.get("React_slope", 0) for u in user_stats]),
    np.array([u.get("Comment_slope", 0) for u in user_stats]),
    np.array([u.get("Post_slope", 0) for u in user_stats]),
]
bar_width = 0.18
plt.subplot(1,4,4)
for i, (vals, label, color) in enumerate(zip(slopes, labels, colors)):
    plt.bar(x + (i-1.5)*bar_width, vals, bar_width, label=label, color=color, alpha=0.85)
    for j, v in enumerate(vals):
        plt.text(j + (i-1.5)*bar_width, v, f"{v:.2f}", ha='center', va='bottom' if v>0 else 'top', fontsize=9)
for i, vals in enumerate(slopes):
    plt.axhline(vals.mean(), color=colors[i], linestyle="--", linewidth=1, label=f"{labels[i]} Mean={vals.mean():.2f}")
plt.xticks(x, uids)
plt.title("Behaviors")
plt.ylabel("Slope")
plt.legend(fontsize=8, loc='upper left', bbox_to_anchor=(1,1))
plt.grid(axis='y', linestyle=':')

plt.suptitle("User Trend Summary (Slope per Metric)", fontsize=16, y=1.04)
plt.tight_layout()
plt.savefig(os.path.join(FAKE_PATH, "all_trends_summary.png"), dpi=200, bbox_inches='tight')
plt.close()

