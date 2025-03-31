module.exports=
{
  expo: {
    name: "aquaponIAPP",
    slug: "aquaponia2",
    version: "1.0.15",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      "supportsTablet": true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.dr34ms.aquaponia2"
    },
    web: {
      favicon: "./assets/icon.png"
    },
    extra: {
      eas: {
        projectId: "8f7c1d42-900c-4588-b326-4b0f9fffa5c0"
      }
    }
  }
}
