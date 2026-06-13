import type { TastingCategory } from "@/db/schema";
import type { PlaceCategory } from "@/features/place/repo/types";

import * as placeRepo from "@/features/place/repo/place-repo";
import * as tastingRepo from "@/features/tasting/repo/tasting-note-repo";

/**
 * E2E 결정적 시딩 (dev 전용).
 *
 * `places` 는 UI(PlacePicker)로만 생성되고 핀은 `getCurrentPosition()` 좌표에
 * 의존하므로, 에뮬레이터 단일 위치로는 9컷(checkpoint-phase-2 Re-verification)의
 * "서로 다른 카테고리 핀 4 + 위시리스트" 를 만들 수 없다. 본 모듈은 고정 id +
 * 서울 기본 region(map.tsx `DEFAULT_REGION` 37.5665, 126.978 / delta 0.05) 근방
 * 오프셋 좌표로 동일한 fixture 를 재현 가능하게 만든다.
 *
 * 진입점: `sip-note:///dev?seed=default` (src/app/dev.tsx). flow 가 항상
 * `clearState` 후 호출하지만, id 충돌 시 멱등하도록 기존 fixture 를 제거 후 재삽입한다.
 */

const DAY = 86_400_000;

type NoteSeed = { name: string; category: TastingCategory; score: number };

type PlaceSeed = {
  id: string;
  name: string;
  category: PlaceCategory;
  latitude: number;
  longitude: number;
  address: string;
  isWishlist?: boolean;
  notes: NoteSeed[];
};

/**
 * 핀 5개: 방문 4(카테고리 bar/distillery/winery/brewery) + 위시리스트 1(빈 핀).
 * 노트가 있는 장소는 visitCount 가 노트 수만큼 채워지고, 노트 date 는 여러 날에
 * 분산되어 홈 피드 DayDivider(cut9) 가 노출된다.
 */
const PLACE_SEEDS: PlaceSeed[] = [
  {
    id: "e2e-bar",
    name: "Aged Oak Bar",
    category: "bar",
    latitude: 37.56,
    longitude: 126.975,
    address: "서울 중구 을지로 1",
    notes: [
      { name: "Lagavulin 16", category: "whiskey", score: 4.5 },
      { name: "Talisker 10", category: "whiskey", score: 4 },
      { name: "Negroni", category: "cocktail", score: 3.5 },
    ],
  },
  {
    id: "e2e-distillery",
    name: "Highland Distillery",
    category: "distillery",
    latitude: 37.572,
    longitude: 126.982,
    address: "서울 종로구 종로 2",
    notes: [],
  },
  {
    id: "e2e-winery",
    name: "Sunset Winery",
    category: "winery",
    latitude: 37.555,
    longitude: 126.985,
    address: "서울 강남구 테헤란로 3",
    notes: [
      { name: "Cabernet Sauvignon", category: "wine", score: 4.5 },
      { name: "Pinot Noir", category: "wine", score: 4 },
      { name: "Chardonnay", category: "wine", score: 3.5 },
      { name: "Merlot", category: "wine", score: 4 },
      { name: "Syrah", category: "wine", score: 4.5 },
      { name: "Riesling", category: "wine", score: 3 },
    ],
  },
  {
    id: "e2e-brewery",
    name: "Riverside Brewery",
    category: "brewery",
    latitude: 37.575,
    longitude: 126.97,
    address: "서울 마포구 양화로 4",
    notes: [{ name: "Hazy IPA", category: "beer", score: 4 }],
  },
  {
    id: "e2e-wish",
    name: "Wishlist Tavern",
    category: "restaurant",
    latitude: 37.565,
    longitude: 126.99,
    address: "서울 용산구 이태원로 5",
    isWishlist: true,
    notes: [],
  },
];

async function clearExisting(): Promise<void> {
  for (const seed of PLACE_SEEDS) {
    const existing = await placeRepo.get(seed.id);
    if (!existing) continue;
    const notes = await tastingRepo.list({ placeId: seed.id });
    for (const note of notes) await tastingRepo.remove(note.id);
    await placeRepo.remove(seed.id);
  }
}

export async function seedFixtures(): Promise<void> {
  await clearExisting();
  const now = Date.now();

  for (const seed of PLACE_SEEDS) {
    await placeRepo.create({
      id: seed.id,
      name: seed.name,
      category: seed.category,
      latitude: seed.latitude,
      longitude: seed.longitude,
      address: seed.address,
      isWishlist: seed.isWishlist ?? false,
    });

    // 노트는 최신순(date desc)으로 정렬되므로 index 0 이 가장 최근(latestNote).
    // 각 노트를 하루씩 과거로 분산해 홈 피드에 여러 DayDivider 가 생기게 한다.
    for (const [i, n] of seed.notes.entries()) {
      await tastingRepo.create({
        name: n.name,
        category: n.category,
        score: n.score,
        date: now - i * DAY,
        placeId: seed.id,
      });
      await placeRepo.incrementVisitCount(seed.id);
    }
  }
}
