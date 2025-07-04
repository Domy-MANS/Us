import SwiftUI
//import Firebase

@main
struct HelpUsApp: App {
    // 在应用启动时配置 Firebase
    init() {
        //FirebaseApp.configure()  // 配置 Firebase
    }

    var body: some Scene {
        WindowGroup {
            ContentView()  // 设置应用的主界面
        }
    }
}
