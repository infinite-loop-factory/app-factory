/**
 * Real GPS coordinates for Seoul Metro stations.
 * Key: station ID, Value: { latitude, longitude }
 * Source: Seoul Metro / Korea Rail Network Authority open data
 */
export const stationCoordinates: Record<
  string,
  { latitude: number; longitude: number }
> = {
  // ── Line 1 ──────────────────────────────────────────────
  "101": { latitude: 37.5547, longitude: 126.9707 }, // 서울역
  "102": { latitude: 37.5702, longitude: 126.9832 }, // 종각
  "103": { latitude: 37.5714, longitude: 126.992 }, // 종로3가
  "104": { latitude: 37.571, longitude: 127.0 }, // 종로5가
  "105": { latitude: 37.571, longitude: 127.0094 }, // 동대문
  "106": { latitude: 37.5751, longitude: 127.0244 }, // 신설동
  "107": { latitude: 37.5806, longitude: 127.035 }, // 제기동
  "108": { latitude: 37.5804, longitude: 127.047 }, // 청량리
  "109": { latitude: 37.5131, longitude: 126.9427 }, // 노량진

  // ── Line 2 ──────────────────────────────────────────────
  "201": { latitude: 37.5638, longitude: 126.9771 }, // 시청
  "202": { latitude: 37.566, longitude: 126.9828 }, // 을지로입구
  "203": { latitude: 37.5663, longitude: 126.992 }, // 을지로3가
  "204": { latitude: 37.567, longitude: 126.998 }, // 을지로4가
  "205": { latitude: 37.565, longitude: 127.0074 }, // 동대문역사문화공원
  "206": { latitude: 37.5658, longitude: 127.0178 }, // 신당
  "207": { latitude: 37.565, longitude: 127.0293 }, // 상왕십리
  "208": { latitude: 37.5614, longitude: 127.037 }, // 왕십리
  "209": { latitude: 37.5403, longitude: 127.0692 }, // 건대입구
  "210": { latitude: 37.5355, longitude: 127.0863 }, // 구의
  "211": { latitude: 37.5352, longitude: 127.0948 }, // 강변
  "212": { latitude: 37.5206, longitude: 127.102 }, // 잠실나루
  "213": { latitude: 37.5133, longitude: 127.1 }, // 잠실
  "214": { latitude: 37.5117, longitude: 127.0863 }, // 잠실새내
  "215": { latitude: 37.5108, longitude: 127.0736 }, // 종합운동장
  "216": { latitude: 37.5089, longitude: 127.0631 }, // 삼성
  "217": { latitude: 37.5046, longitude: 127.0486 }, // 선릉
  "218": { latitude: 37.5007, longitude: 127.0368 }, // 역삼
  "219": { latitude: 37.4979, longitude: 127.0276 }, // 강남
  "220": { latitude: 37.4934, longitude: 127.0143 }, // 교대
  "221": { latitude: 37.4919, longitude: 127.0073 }, // 서초
  "222": { latitude: 37.4814, longitude: 126.9976 }, // 방배
  "223": { latitude: 37.4765, longitude: 126.9816 }, // 사당
  "224": { latitude: 37.4844, longitude: 126.9296 }, // 신림
  "225": { latitude: 37.4874, longitude: 126.9234 }, // 신대방
  "226": { latitude: 37.4852, longitude: 126.9012 }, // 구로디지털단지
  "227": { latitude: 37.4933, longitude: 126.8959 }, // 대림
  "228": { latitude: 37.5089, longitude: 126.8912 }, // 신도림
  "229": { latitude: 37.5179, longitude: 126.8948 }, // 문래
  "230": { latitude: 37.5246, longitude: 126.8962 }, // 영등포구청
  "231": { latitude: 37.5345, longitude: 126.9028 }, // 당산
  "232": { latitude: 37.5494, longitude: 126.9137 }, // 합정
  "233": { latitude: 37.5573, longitude: 126.9248 }, // 홍대입구
  "234": { latitude: 37.5554, longitude: 126.9367 }, // 신촌
  "235": { latitude: 37.5568, longitude: 126.9462 }, // 이대
  "236": { latitude: 37.5571, longitude: 126.956 }, // 아현
  "237": { latitude: 37.5601, longitude: 126.9637 }, // 충정로

  // ── Line 3 ──────────────────────────────────────────────
  "301": { latitude: 37.6189, longitude: 126.9213 }, // 연신내
  "302": { latitude: 37.6105, longitude: 126.9146 }, // 불광
  "303": { latitude: 37.604, longitude: 126.9187 }, // 녹번
  "304": { latitude: 37.5887, longitude: 126.9217 }, // 홍제
  "305": { latitude: 37.583, longitude: 126.9501 }, // 무악재
  "306": { latitude: 37.5758, longitude: 126.9601 }, // 독립문
  "307": { latitude: 37.5763, longitude: 126.9756 }, // 경복궁
  "308": { latitude: 37.5764, longitude: 126.9854 }, // 안국
  "309": { latitude: 37.5614, longitude: 126.9947 }, // 충무로
  "310": { latitude: 37.558, longitude: 126.9985 }, // 동대입구
  "311": { latitude: 37.5544, longitude: 127.0102 }, // 약수
  "312": { latitude: 37.5468, longitude: 127.0134 }, // 금호
  "313": { latitude: 37.5404, longitude: 127.0172 }, // 옥수
  "314": { latitude: 37.527, longitude: 127.0283 }, // 압구정
  "315": { latitude: 37.5166, longitude: 127.0246 }, // 신사
  "316": { latitude: 37.5114, longitude: 127.017 }, // 잠원
  "317": { latitude: 37.5049, longitude: 127.0049 }, // 고속터미널
  "318": { latitude: 37.4937, longitude: 127.0143 }, // 교대
  "319": { latitude: 37.4855, longitude: 127.0165 }, // 남부터미널
  "320": { latitude: 37.4842, longitude: 127.0345 }, // 양재
  "321": { latitude: 37.4782, longitude: 127.0379 }, // 매봉
  "322": { latitude: 37.4707, longitude: 127.0483 }, // 도곡
  "323": { latitude: 37.4943, longitude: 127.063 }, // 대치
  "324": { latitude: 37.4962, longitude: 127.0713 }, // 학여울
  "325": { latitude: 37.4926, longitude: 127.0815 }, // 대청
  "326": { latitude: 37.4847, longitude: 127.0856 }, // 일원
  "327": { latitude: 37.487, longitude: 127.1019 }, // 수서

  // ── Line 4 ──────────────────────────────────────────────
  "401": { latitude: 37.6606, longitude: 127.0476 }, // 당고개
  "402": { latitude: 37.654, longitude: 127.052 }, // 상계
  "403": { latitude: 37.6547, longitude: 127.0615 }, // 노원
  "404": { latitude: 37.6533, longitude: 127.0735 }, // 창동
  "405": { latitude: 37.6481, longitude: 127.0345 }, // 쌍문
  "406": { latitude: 37.6389, longitude: 127.0252 }, // 수유
  "407": { latitude: 37.6265, longitude: 127.026 }, // 미아
  "408": { latitude: 37.6138, longitude: 127.03 }, // 미아삼거리
  "409": { latitude: 37.6035, longitude: 127.0252 }, // 길음
  "410": { latitude: 37.5928, longitude: 127.0164 }, // 성신여대입구
  "411": { latitude: 37.5888, longitude: 127.0065 }, // 한성대입구
  "412": { latitude: 37.5828, longitude: 126.999 }, // 혜화
  "413": { latitude: 37.5714, longitude: 127.0094 }, // 동대문
  "414": { latitude: 37.565, longitude: 127.0074 }, // 동대문역사문화공원
  "415": { latitude: 37.5614, longitude: 126.9947 }, // 충무로
  "416": { latitude: 37.5605, longitude: 126.9864 }, // 명동
  "417": { latitude: 37.5573, longitude: 126.9822 }, // 회현
  "418": { latitude: 37.5547, longitude: 126.9707 }, // 서울역
  "419": { latitude: 37.5448, longitude: 126.9722 }, // 숙대입구
  "420": { latitude: 37.5347, longitude: 126.9727 }, // 삼각지
  "421": { latitude: 37.528, longitude: 126.9717 }, // 신용산
  "422": { latitude: 37.5216, longitude: 126.9702 }, // 이촌
  "423": { latitude: 37.5071, longitude: 126.9578 }, // 동작
  "424": { latitude: 37.4876, longitude: 126.9537 }, // 총신대입구
  "425": { latitude: 37.4765, longitude: 126.9816 }, // 사당

  // ── Line 5 ──────────────────────────────────────────────
  "501": { latitude: 37.5737, longitude: 126.8145 }, // 방화
  "502": { latitude: 37.5722, longitude: 126.8057 }, // 개화산
  "503": { latitude: 37.5618, longitude: 126.801 }, // 김포공항
  "504": { latitude: 37.5571, longitude: 126.799 }, // 송정
  "505": { latitude: 37.5593, longitude: 126.8241 }, // 마곡
  "506": { latitude: 37.5571, longitude: 126.8379 }, // 발산
  "507": { latitude: 37.547, longitude: 126.8427 }, // 우장산
  "508": { latitude: 37.5409, longitude: 126.8395 }, // 화곡
  "509": { latitude: 37.5316, longitude: 126.8473 }, // 까치산
  "510": { latitude: 37.5283, longitude: 126.856 }, // 신정
  "511": { latitude: 37.5292, longitude: 126.868 }, // 목동
  "512": { latitude: 37.524, longitude: 126.8757 }, // 오목교
  "513": { latitude: 37.5253, longitude: 126.8855 }, // 양평
  "514": { latitude: 37.5246, longitude: 126.8962 }, // 영등포구청
  "515": { latitude: 37.5224, longitude: 126.9044 }, // 영등포시장
  "516": { latitude: 37.5149, longitude: 126.9177 }, // 신길
  "517": { latitude: 37.5219, longitude: 126.9249 }, // 여의도
  "518": { latitude: 37.5269, longitude: 126.9327 }, // 여의나루
  "519": { latitude: 37.5393, longitude: 126.9452 }, // 마포
  "520": { latitude: 37.5436, longitude: 126.9511 }, // 공덕
  "521": { latitude: 37.553, longitude: 126.9568 }, // 애오개
  "522": { latitude: 37.5601, longitude: 126.9637 }, // 충정로
  "523": { latitude: 37.5651, longitude: 126.9664 }, // 서대문
  "524": { latitude: 37.571, longitude: 126.9768 }, // 광화문
  "525": { latitude: 37.5714, longitude: 126.992 }, // 종로3가
  "526": { latitude: 37.567, longitude: 126.998 }, // 을지로4가
  "527": { latitude: 37.565, longitude: 127.0074 }, // 동대문역사문화공원
  "528": { latitude: 37.56, longitude: 127.0149 }, // 청구
  "529": { latitude: 37.5614, longitude: 127.037 }, // 왕십리
  "530": { latitude: 37.5573, longitude: 127.0355 }, // 행당
  "531": { latitude: 37.55, longitude: 127.0536 }, // 답십리
  "532": { latitude: 37.5618, longitude: 127.0644 }, // 장한평
  "533": { latitude: 37.5572, longitude: 127.0793 }, // 군자
  "534": { latitude: 37.5508, longitude: 127.0862 }, // 아차산
  "535": { latitude: 37.5452, longitude: 127.0936 }, // 광나루
  "536": { latitude: 37.5389, longitude: 127.1243 }, // 천호
  "537": { latitude: 37.5301, longitude: 127.1329 }, // 강동
  "538": { latitude: 37.53, longitude: 127.1437 }, // 길동
  "539": { latitude: 37.527, longitude: 127.1503 }, // 굽은다리
  "540": { latitude: 37.5285, longitude: 127.1549 }, // 명일
  "541": { latitude: 37.5551, longitude: 127.1535 }, // 고덕
  "542": { latitude: 37.5574, longitude: 127.167 }, // 상일동
  "543": { latitude: 37.549, longitude: 127.1837 }, // 하남검단산

  // ── Line 7 ──────────────────────────────────────────────
  "701": { latitude: 37.6583, longitude: 127.0644 }, // 장암
  "702": { latitude: 37.6501, longitude: 127.0474 }, // 도봉산
  "703": { latitude: 37.6395, longitude: 127.0564 }, // 수락산
  "704": { latitude: 37.6322, longitude: 127.0565 }, // 마들
  "705": { latitude: 37.6547, longitude: 127.0615 }, // 노원
  "706": { latitude: 37.6435, longitude: 127.0642 }, // 중계
  "707": { latitude: 37.6357, longitude: 127.0675 }, // 하계
  "708": { latitude: 37.6258, longitude: 127.0723 }, // 공릉
  "709": { latitude: 37.6181, longitude: 127.0768 }, // 태릉입구
  "710": { latitude: 37.6101, longitude: 127.0778 }, // 먹골
  "711": { latitude: 37.602, longitude: 127.0799 }, // 중화
  "712": { latitude: 37.5961, longitude: 127.0853 }, // 상봉
  "713": { latitude: 37.5817, longitude: 127.0824 }, // 면목
  "714": { latitude: 37.573, longitude: 127.0828 }, // 사가정
  "715": { latitude: 37.5656, longitude: 127.0857 }, // 용마산
  "716": { latitude: 37.5575, longitude: 127.0835 }, // 중곡
  "717": { latitude: 37.5572, longitude: 127.0793 }, // 군자
  "718": { latitude: 37.5482, longitude: 127.0747 }, // 어린이대공원
  "719": { latitude: 37.5403, longitude: 127.0692 }, // 건대입구
  "720": { latitude: 37.5312, longitude: 127.0621 }, // 뚝섬유원지
  "721": { latitude: 37.5204, longitude: 127.0534 }, // 청담
  "722": { latitude: 37.5174, longitude: 127.0415 }, // 강남구청
  "723": { latitude: 37.5145, longitude: 127.0321 }, // 학동
  "724": { latitude: 37.511, longitude: 127.023 }, // 논현
  "725": { latitude: 37.5078, longitude: 127.0115 }, // 반포
  "726": { latitude: 37.5049, longitude: 127.0049 }, // 고속터미널
  "727": { latitude: 37.4879, longitude: 126.9935 }, // 내방
  "728": { latitude: 37.486, longitude: 126.9817 }, // 이수
  "729": { latitude: 37.4868, longitude: 126.9688 }, // 남성
  "730": { latitude: 37.4966, longitude: 126.9536 }, // 숭실대입구
  "731": { latitude: 37.5029, longitude: 126.9438 }, // 상도
  "732": { latitude: 37.5048, longitude: 126.9352 }, // 장승배기
  "733": { latitude: 37.4966, longitude: 126.9277 }, // 신대방삼거리
  "734": { latitude: 37.4961, longitude: 126.9188 }, // 보라매
  "735": { latitude: 37.5042, longitude: 126.9089 }, // 신풍
  "736": { latitude: 37.4933, longitude: 126.8959 }, // 대림
  "737": { latitude: 37.4857, longitude: 126.8878 }, // 남구로
  "738": { latitude: 37.4816, longitude: 126.8825 }, // 가산디지털단지

  // ── Line 9 ──────────────────────────────────────────────
  "901": { latitude: 37.5737, longitude: 126.8052 }, // 개화
  "902": { latitude: 37.5618, longitude: 126.801 }, // 김포공항
  "903": { latitude: 37.5633, longitude: 126.8107 }, // 공항시장
  "904": { latitude: 37.5667, longitude: 126.8204 }, // 신방화
  "905": { latitude: 37.5669, longitude: 126.8337 }, // 마곡나루
  "906": { latitude: 37.559, longitude: 126.8481 }, // 양천향교
  "907": { latitude: 37.5613, longitude: 126.8567 }, // 가양
  "908": { latitude: 37.5573, longitude: 126.8675 }, // 증미
  "909": { latitude: 37.551, longitude: 126.8753 }, // 등촌
  "910": { latitude: 37.5466, longitude: 126.8867 }, // 염창
  "911": { latitude: 37.5387, longitude: 126.8937 }, // 신목동
  "912": { latitude: 37.5334, longitude: 126.899 }, // 선유도
  "913": { latitude: 37.5345, longitude: 126.9028 }, // 당산
  "914": { latitude: 37.5278, longitude: 126.9174 }, // 국회의사당
  "915": { latitude: 37.5219, longitude: 126.9249 }, // 여의도
  "916": { latitude: 37.5166, longitude: 126.9292 }, // 샛강
  "917": { latitude: 37.5131, longitude: 126.9427 }, // 노량진
  "918": { latitude: 37.5112, longitude: 126.9504 }, // 노들
  "919": { latitude: 37.5084, longitude: 126.956 }, // 흑석
  "920": { latitude: 37.5071, longitude: 126.9578 }, // 동작
  "921": { latitude: 37.5018, longitude: 126.9881 }, // 구반포
  "922": { latitude: 37.5044, longitude: 126.9945 }, // 신반포
  "923": { latitude: 37.5049, longitude: 127.0049 }, // 고속터미널
  "924": { latitude: 37.5078, longitude: 127.0153 }, // 사평
  "925": { latitude: 37.5047, longitude: 127.0233 }, // 신논현
  "926": { latitude: 37.5068, longitude: 127.0334 }, // 언주
  "927": { latitude: 37.5107, longitude: 127.0438 }, // 선정릉
  "928": { latitude: 37.5106, longitude: 127.056 }, // 삼성중앙
  "929": { latitude: 37.5134, longitude: 127.0618 }, // 봉은사
  "930": { latitude: 37.5108, longitude: 127.0736 }, // 종합운동장

  // ── Shinbundang Line ────────────────────────────────────
  "1001": { latitude: 37.4979, longitude: 127.0276 }, // 강남
  "1002": { latitude: 37.4842, longitude: 127.0345 }, // 양재
  "1003": { latitude: 37.4707, longitude: 127.0386 }, // 양재시민의숲
  "1004": { latitude: 37.449, longitude: 127.0553 }, // 청계산입구
  "1005": { latitude: 37.3945, longitude: 127.1108 }, // 판교
  "1006": { latitude: 37.3666, longitude: 127.1065 }, // 정자
};
