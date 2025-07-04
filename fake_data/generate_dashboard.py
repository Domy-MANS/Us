import pandas as pd
import matplotlib.pyplot as plt
import os

FAKE_PATH = os.path.expanduser("~/Desktop/Us/fake_data/")
user_files = [f for f in os.listdir(FAKE_PATH) if f.startswith('user_') and f.endswith('.csv')]
user_files.sort()

num_users = len(user_files)
fig, axes = plt.subplots(num_users, 3, figsize=(18, 4*num_users))

if num_users == 1:
    axes = [axes]

for idx, fname in enumerate(user_files):
    df = pd.read_csv(os.path.join(FAKE_PATH, fname))
    uid = df['userId'][0]
    x = range(len(df['date']))
    width = 0.18

    ax = axes[idx][0]
    ax.plot(df['date'], df['mood_A'], marker='o', label='Sad/Lonely (A)', color='orange')
    ax.plot(df['date'], df['mood_B'], marker='o', label='Happy/Driven (B)', color='green')
    ax.plot(df['date'], df['mood_C'], marker='o', label='Anxious/Confused (C)', color='blue')
    ax.set_title(f"{uid} - Mood Trends")
    ax.set_ylabel('Count')
    ax.legend()
    ax.grid(True)

    online = [int(s.split('h')[0])*60 + int(s.split('h')[1].replace('m','').strip()) if 'h' in s else int(s.replace('m','').strip()) for s in df['online_time']]
    ax2 = axes[idx][1]
    ax2.plot(df['date'], online, marker='o', color='purple', label='Online Time (min)')
    ax2.set_title(f"{uid} - Online Time")
    ax2.set_ylabel('Minutes')
    ax2.legend()
    ax2.grid(True)

    ax3 = axes[idx][2]
    ax3.bar([i-1.5*width for i in x], df['join_us'], width, label='Join Us')
    ax3.bar([i-0.5*width for i in x], df['react_post'], width, label='React Post')
    ax3.bar([i+0.5*width for i in x], df['comment_post'], width, label='Comment Post')
    ax3.bar([i+1.5*width for i in x], df['post_emotion'], width, label='Post Emotion')
    ax3.set_xticks(x)
    ax3.set_xticklabels(df['date'], rotation=30)
    ax3.set_ylabel('Count')
    ax3.set_title(f"{uid} - Behavior")
    ax3.legend()
    ax3.grid(True)

plt.tight_layout()
plt.savefig(os.path.join(FAKE_PATH, "dashboard_summary.png"), dpi=200)
plt.close()
