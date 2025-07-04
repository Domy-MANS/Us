import SwiftUI

struct ContentView: View {
    @State private var textIndex = 0
    @State private var displayedText = ""
    @State private var isDeleting = false

    let texts = [
        "Welcome to HelpUs!",
        "Help the person U used to be!",
        "Help Us in pain!"
    ]

    let typingSpeed = 0.1 // 文字打字速度
    let deleteSpeed = 0.05 // 文字删除速度
    let delayBetweenTexts = 1.0 // 句子切换间隔

    var body: some View {
        ZStack {
            Color.white // 白色背景
                .edgesIgnoringSafeArea(.all)

            VStack(spacing: 30) { // 增加间距
                // 三行相同的文字
                ForEach(0..<3, id: \.self) { _ in
                    HStack(spacing: 0) {
                        let words = displayedText.split(separator: "U", omittingEmptySubsequences: true)
                        if words.count > 1 {
                            Text(words[0]) // 前半部分
                                .foregroundColor(.black) // 黑色文字
                                .font(.custom("Helvetica Neue", size: 60)) // 使用现代字体并增大字号
                            Text("U") // 突出的 U
                                .foregroundColor(.blue) // 蓝色 U 颜色
                                .font(.custom("Helvetica Neue", size: 70)) // 增大 U 的字号
                            Text(words[1]) // 后半部分
                                .foregroundColor(.black)
                                .font(.custom("Helvetica Neue", size: 60))
                        } else {
                            Text(displayedText)
                                .foregroundColor(.black)
                                .font(.custom("Helvetica Neue", size: 60))
                        }
                    }
                }

                Spacer()

                // 简洁的按钮
                VStack(spacing: 20) {
                    Button(action: {}) {
                        Text("注册 Register")
                            .font(.custom("Helvetica Neue", size: 18)) // 使用现代字体
                            .foregroundColor(.black) // 黑色文字
                            .padding(.horizontal, 20) // 增加按钮内边距
                            .padding(.vertical, 10)
                            .background(
                                RoundedRectangle(cornerRadius: 10) // 圆角矩形背景
                                    .fill(Color.white)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 10)
                                            .stroke(Color.black, lineWidth: 1) // 黑色边框
                                    )
                            )
                    }
                    Button(action: {}) {
                        Text("登陆 Login")
                            .font(.custom("Helvetica Neue", size: 18))
                            .foregroundColor(.black)
                            .padding(.horizontal, 20)
                            .padding(.vertical, 10)
                            .background(
                                RoundedRectangle(cornerRadius: 10)
                                    .fill(Color.white)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 10)
                                            .stroke(Color.black, lineWidth: 1)
                                    )
                            )
                    }
                    Button(action: {}) {
                        Text("匿名 Anonymous")
                            .font(.custom("Helvetica Neue", size: 18))
                            .foregroundColor(.black)
                            .padding(.horizontal, 20)
                            .padding(.vertical, 10)
                            .background(
                                RoundedRectangle(cornerRadius: 10)
                                    .fill(Color.white)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 10)
                                            .stroke(Color.black, lineWidth: 1)
                                    )
                            )
                    }
                }
                .padding(.horizontal)
            }
            .padding()
        }
        .onAppear {
            typeText()
        }
    }

    // 打字机效果
    private func typeText() {
        Timer.scheduledTimer(withTimeInterval: typingSpeed, repeats: true) { timer in
            let currentText = texts[textIndex]
            if isDeleting {
                if displayedText.isEmpty {
                    isDeleting = false
                    textIndex = (textIndex + 1) % texts.count
                    DispatchQueue.main.asyncAfter(deadline: .now() + delayBetweenTexts) {
                        typeText()
                    }
                    timer.invalidate()
                } else {
                    displayedText.removeLast()
                }
            } else {
                if displayedText.count < currentText.count {
                    let index = currentText.index(currentText.startIndex, offsetBy: displayedText.count)
                    displayedText.append(currentText[index])
                } else {
                    DispatchQueue.main.asyncAfter(deadline: .now() + delayBetweenTexts) {
                        isDeleting = true
                    }
                }
            }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
