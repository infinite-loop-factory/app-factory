import { StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

interface IData {
  id: string;
  title: string;
  image: string;
  distance: number;
  totalTime: number;
  address: string;
  rate: number;
  latitude: number;
  longitude: number;
}

interface IKakaoMapProps {
  latitude: number;
  longitude: number;
  data: IData[];
}

export default function KakaoMap({
  latitude,
  longitude,
  data,
}: IKakaoMapProps) {
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

            // 배열 데이터의 마커 추가
            const locations = ${JSON.stringify(data)};
            locations.forEach(item => {
              const markerPosition = new kakao.maps.LatLng(item.latitude, item.longitude);
              const marker = new kakao.maps.Marker({
                position: markerPosition,
              });
              marker.setMap(map);
            });


            // 현재 위치 마커 추가
            const currentMarkerPosition = new kakao.maps.LatLng(${latitude}, ${longitude});
            
            const currentMarker = new kakao.maps.Marker({
              position: currentMarkerPosition
            });
            
            currentMarker.setMap(map);
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

const styles = StyleSheet.create({ container: { width: "100%", flex: 1 } });
