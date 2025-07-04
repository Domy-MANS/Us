import pandas as pd
import os
from scipy.stats import linregress

FAKE_PATH = os.path.expanduser("~/Desktop/Us/fake_data/")
report_path = os.path.join(FAKE_PATH, "trend_report.txt")

total_users = 0
moodB_up = moodA_down = moodC_down = 0
online_up = join_us_up = react_post_up = comment_post_up = post_emotion_up = 0

lines = []
user_blocks = []

for fname in os.listdir(FAKE_PATH):
    if fname.startswith("user_") and fname.endswith(".csv"):
        df = pd.read_csv(os.path.join(FAKE_PATH, fname))
        uid = df['userId'][0]
        total_users += 1

        def get_trend(y):
            if len(y) < 2: return (0, 0)
            x = range(len(y))
            slope, intercept, r, p, stderr = linregress(x, y)
            return slope, r

        moodA_trend, moodA_r = get_trend(df['mood_A'])
        moodB_trend, moodB_r = get_trend(df['mood_B'])
        moodC_trend, moodC_r = get_trend(df['mood_C'])
        online_time_num = [
            int(s.split('h')[0])*60 + int(s.split('h')[1].replace('m','').strip())
            if 'h' in s else int(s.replace('m','').strip())
            for s in df['online_time']
        ]
        online_trend, online_r = get_trend(online_time_num)
        join_us_trend, join_us_r = get_trend(df['join_us'])
        react_post_trend, react_post_r = get_trend(df['react_post'])
        comment_post_trend, comment_post_r = get_trend(df['comment_post'])
        post_emotion_trend, post_emotion_r = get_trend(df['post_emotion'])

        if moodB_trend > 0: moodB_up += 1
        if moodA_trend < 0: moodA_down += 1
        if moodC_trend < 0: moodC_down += 1
        if online_trend > 0: online_up += 1
        if join_us_trend > 0: join_us_up += 1
        if react_post_trend > 0: react_post_up += 1
        if comment_post_trend > 0: comment_post_up += 1
        if post_emotion_trend > 0: post_emotion_up += 1

        block = []
        block.append(f"User {uid}:")
        block.append(f"  Mood B (happy/driven) trend: slope={moodB_trend:.3f}, R={moodB_r:.3f}  |  {'↑' if moodB_trend>0 else ('↓' if moodB_trend<0 else '=')}")
        block.append(f"  Mood A (sad/lonely) trend: slope={moodA_trend:.3f}, R={moodA_r:.3f}  |  {'↓' if moodA_trend<0 else ('↑' if moodA_trend>0 else '=')}")
        block.append(f"  Mood C (anxious/confused) trend: slope={moodC_trend:.3f}, R={moodC_r:.3f}  |  {'↓' if moodC_trend<0 else ('↑' if moodC_trend>0 else '=')}")
        block.append(f"  Online time trend: slope={online_trend:.3f} (min/day), R={online_r:.3f}  |  {'↑' if online_trend>0 else ('↓' if online_trend<0 else '=')}")
        block.append(f"  Join Us trend: slope={join_us_trend:.3f}, R={join_us_r:.3f}  |  {'↑' if join_us_trend>0 else ('↓' if join_us_trend<0 else '=')}")
        block.append(f"  React Post trend: slope={react_post_trend:.3f}, R={react_post_r:.3f}  |  {'↑' if react_post_trend>0 else ('↓' if react_post_trend<0 else '=')}")
        block.append(f"  Comment Post trend: slope={comment_post_trend:.3f}, R={comment_post_r:.3f}  |  {'↑' if comment_post_trend>0 else ('↓' if comment_post_trend<0 else '=')}")
        block.append(f"  Post Emotion trend: slope={post_emotion_trend:.3f}, R={post_emotion_r:.3f}  |  {'↑' if post_emotion_trend>0 else ('↓' if post_emotion_trend<0 else '=')}")

        if moodB_trend > 0:
            block.append("    👍 Mood B (happy/driven) is increasing.")
        elif moodB_trend < 0:
            block.append("    👎 Mood B (happy/driven) is decreasing.")
        else:
            block.append("    = Mood B (happy/driven) is stable.")

        if moodA_trend < 0:
            block.append("    👍 Mood A (sad/lonely) is decreasing.")
        elif moodA_trend > 0:
            block.append("    👎 Mood A (sad/lonely) is increasing.")
        else:
            block.append("    = Mood A (sad/lonely) is stable.")

        if moodC_trend < 0:
            block.append("    👍 Mood C (anxious/confused) is decreasing.")
        elif moodC_trend > 0:
            block.append("    👎 Mood C (anxious/confused) is increasing.")
        else:
            block.append("    = Mood C (anxious/confused) is stable.")

        if online_trend > 0:
            block.append("    🕒 Online time is increasing.")
        elif online_trend < 0:
            block.append("    🕒 Online time is decreasing.")
        else:
            block.append("    = Online time is stable.")

        if join_us_trend > 0:
            block.append("    🟢 Join Us behavior is increasing.")
        elif join_us_trend < 0:
            block.append("    🔴 Join Us behavior is decreasing.")
        else:
            block.append("    = Join Us behavior is stable.")

        if react_post_trend > 0:
            block.append("    🟢 React Post behavior is increasing.")
        elif react_post_trend < 0:
            block.append("    🔴 React Post behavior is decreasing.")
        else:
            block.append("    = React Post behavior is stable.")

        if comment_post_trend > 0:
            block.append("    🟢 Comment Post behavior is increasing.")
        elif comment_post_trend < 0:
            block.append("    🔴 Comment Post behavior is decreasing.")
        else:
            block.append("    = Comment Post behavior is stable.")

        if post_emotion_trend > 0:
            block.append("    🟢 Post Emotion behavior is increasing.")
        elif post_emotion_trend < 0:
            block.append("    🔴 Post Emotion behavior is decreasing.")
        else:
            block.append("    = Post Emotion behavior is stable.")

        block.append("")
        user_blocks.append('\n'.join(block))

summary = [
    f"Summary:",
    f"Users analyzed: {total_users}",
    f"- {moodB_up} users show increasing Mood B (happy/driven).",
    f"- {moodA_down} users show decreasing Mood A (sad/lonely).",
    f"- {moodC_down} users show decreasing Mood C (anxious/confused).",
    f"- {online_up} users show increasing online time.",
    f"- {join_us_up} users show increasing Join Us behavior.",
    f"- {react_post_up} users show increasing React Post behavior.",
    f"- {comment_post_up} users show increasing Comment Post behavior.",
    f"- {post_emotion_up} users show increasing Post Emotion behavior.",
    "-"*42,
    ""
]

with open(report_path, "w") as f:
    f.write('\n'.join(summary + user_blocks))
