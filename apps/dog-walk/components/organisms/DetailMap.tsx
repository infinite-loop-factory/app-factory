import usePedestrianRoutes from "@/hooks/usePedestrianRoutes";
import { useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

interface IDetailMapProps {
  start: {
    latitude: number;
    longitude: number;
  };
  end: {
    latitude: number;
    longitude: number;
  };
}

export default function DetailMap({ start, end }: IDetailMapProps) {
  const webViewRef = useRef<WebView>(null);

  const [isWebViewReady, setIsWebViewReady] = useState(false);

  const { getRoutes, pathCoords } = usePedestrianRoutes();

  const html = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.EXPO_PUBLIC_KAKAO_MAPS_KEY}&libraries=services"></script>
      </head>
      <body style="margin:0;padding:0;">
        <div id="map" style="width:100%;height:100%"></div>
        <script>
          let map;
  
          function drawPath(path) {
            const linePath = path.map(coord => new kakao.maps.LatLng(coord.lat, coord.lon));
          
            const polyline = new kakao.maps.Polyline({
              path: linePath,
              strokeWeight: 5,
              strokeColor: '#A9746E',
              strokeOpacity: 0.8,
              strokeStyle: 'solid'
            });
          
            polyline.setMap(map);
  
            // NOTE: 경로 전체가 화면에 보이도록 설정
            const bounds = new kakao.maps.LatLngBounds();
            linePath.forEach(p => bounds.extend(p));
            map.setBounds(bounds);
          }
  
          document.addEventListener("DOMContentLoaded", function() {
            function waitForKakao() {
              if (window.kakao && window.kakao.maps) {
                initMap();
                window.ReactNativeWebView.postMessage("READY");
              } else {
                setTimeout(waitForKakao, 100);
              }
            }
  
            function initMap() {
              const container = document.getElementById('map');
  
              const options = {
                center: new kakao.maps.LatLng(${start.latitude}, ${start.longitude}),
                level: 3
              };
  
              map = new kakao.maps.Map(container, options);
  
              const startSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/red_b.png',
                startSize = new kakao.maps.Size(50, 45),
                startOption = { 
                  offset: new kakao.maps.Point(15, 43)
                };
  
  
              const startImage = new kakao.maps.MarkerImage(startSrc, startSize, startOption);
  
  
              const arriveSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/blue_b.png',
                arriveSize = new kakao.maps.Size(50, 45),
                arriveOption = { 
                  offset: new kakao.maps.Point(15, 43)
                };
  
              const arriveImage = new kakao.maps.MarkerImage(arriveSrc, arriveSize, arriveOption);
  
              const locations = ${JSON.stringify([start, end])};
  
              locations.forEach((item, index) => {
                const markerPosition = new kakao.maps.LatLng(item.latitude, item.longitude);
                const marker = new kakao.maps.Marker({
                  position: markerPosition,
                  image: index === 0 ? startImage : arriveImage
                });
  
                marker.setMap(map);
  
              });
  
            }
  
            waitForKakao();
          });
  
          // NOTE: 메시지 수신 설정
          document.addEventListener("message", function (event) {
            try {
              const coords = JSON.parse(event.data);
              drawPath(coords);
            } catch (err) {
              console.error("Kakao Map Error :", err);
            }
          });
        </script>
      </body>
    </html>    
    `;

  useEffect(() => {
    getRoutes({ start, end });
  }, [start, end, getRoutes]);

  useEffect(() => {
    if (isWebViewReady && pathCoords.length > 0) {
      setTimeout(() => {
        webViewRef.current?.postMessage(JSON.stringify(pathCoords));
      }, 300);
    }
  }, [isWebViewReady, pathCoords]);

  return (
    <WebView
      ref={webViewRef}
      style={styles.container}
      source={{ html }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      onMessage={(event) => {
        const msg = event.nativeEvent.data;

        if (msg === "READY") {
          setIsWebViewReady(true);
        }
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    width: "100%",
    height: 200,
    flex: 1,
  },
});
