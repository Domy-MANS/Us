import pandas as pd
import matplotlib.pyplot as plt
import os

FAKE_PATH = os.path.expanduser("~/Desktop/Us/fake_data/")

for fname in os.listdir(FAKE_PATH):
    if fname.startswith("user_") and fname.endswith(".csv"):
        path = os.path.join(FAKE_PATH, fname)
        df = pd.read_csv(path)

        plt.figure(figsize=(8, 5))
        plt.plot(df['date'], df['mood_A'], marker='o', label='Mood A (Sad/Lonely)')
        plt.plot(df['date'], df['mood_B'], marker='o', label='Mood B (Happy/Driven)')
        plt.plot(df['date'], df['mood_C'], marker='o', label='Mood C (Anxious/Confused)')
        plt.xlabel('Date')
        plt.ylabel('Count')
        plt.title(f"{df['userId'][0]} Mood Trend")
        plt.legend()
        plt.tight_layout()
        plt.savefig(os.path.join(FAKE_PATH, fname.replace('.csv', '_mood_trend.png')))
        plt.close()

        plt.figure(figsize=(10, 5))
        width = 0.2
        x = range(len(df['date']))
        plt.bar([i - width * 1.5 for i in x], df['join_us'], width, label='Join Us')
        plt.bar([i - width * 0.5 for i in x], df['react_post'], width, label='React Post')
        plt.bar([i + width * 0.5 for i in x], df['comment_post'], width, label='Comment Post')
        plt.bar([i + width * 1.5 for i in x], df['post_emotion'], width, label='Post Emotion')
        plt.xticks(list(x), df['date'], rotation=45)
        plt.ylabel('Count')
        plt.title(f"{df['userId'][0]} Behavior Statistics")
        plt.legend()
        plt.tight_layout()
        plt.savefig(os.path.join(FAKE_PATH, fname.replace('.csv', '_behavior_bar.png')))
        plt.close()

        def time_to_min(tstr):
            tstr = str(tstr)
            if 'h' in tstr:
                h, m = tstr.split('h')
                return int(h.strip()) * 60 + int(m.replace('m', '').strip())
            else:
                return int(tstr.replace('m', '').strip())
        online_minutes = df['online_time'].apply(time_to_min)

        plt.figure(figsize=(8, 5))
        plt.plot(df['date'], online_minutes, marker='o', color='orange', label='Online Time (min)')
        plt.xlabel('Date')
        plt.ylabel('Online Time (min)')
        plt.title(f"{df['userId'][0]} Online Time Trend")
        plt.legend()
        plt.tight_layout()
        plt.savefig(os.path.join(FAKE_PATH, fname.replace('.csv', '_online_time.png')))
        plt.close()
