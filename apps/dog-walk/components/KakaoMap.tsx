import { StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

interface IKakaoMapProps {
  latitude: number;
  longitude: number;
}

export default function KakaoMap({ latitude, longitude }: IKakaoMapProps) {
  const html = `
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.EXPO_PUBLIC_KAKAO_MAPS_KEY}&libraries=services"></script>
    </head>
    <body style="margin:0;padding:0;">
    <div id="map" style="width:100%;height:50vh"></div>
    <script>
        document.addEventListener("DOMContentLoaded", function() {
          function waitForKakao() {
            if (window.kakao && window.kakao.maps) {
              initMap();
            } else {
              setTimeout(waitForKakao, 100);
            }
          }

          function initMap() {
            const container = document.getElementById('map');
            const options = {
              center: new kakao.maps.LatLng(${latitude}, ${longitude}),
              level: 3
            };
            const map = new kakao.maps.Map(container, options);

            // 마커 생성 및 지도에 추가
            const markerPosition = new kakao.maps.LatLng(${latitude}, ${longitude});
            const marker = new kakao.maps.Marker({
              position: markerPosition
            });
            marker.setMap(map);
          }

          waitForKakao();
        });
      </script>
    </body>
  </html>    
  `;

  return (
    <WebView
      style={styles.container}
      source={{ html: html }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
  },
});
