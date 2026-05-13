import WidgetKit

private let appGroupID = "group.com.gracefullight.countrytracker"
private let snapshotKey = "snapshot"

struct CountryProvider: TimelineProvider {
    func placeholder(in context: Context) -> CountryEntry {
        let example = WidgetSnapshot(
            totalCountries: 5,
            totalDays: 30,
            recent: [
                RecentCountry(code: "JP", flag: "🇯🇵", name: "Japan", days: 5),
                RecentCountry(code: "KR", flag: "🇰🇷", name: "Korea", days: 10),
                RecentCountry(code: "FR", flag: "🇫🇷", name: "France", days: 7),
            ],
            updatedAt: ""
        )
        return CountryEntry(date: .now, snapshot: example)
    }

    func getSnapshot(in context: Context, completion: @escaping (CountryEntry) -> Void) {
        let entry = CountryEntry(date: .now, snapshot: loadSnapshot())
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<CountryEntry>) -> Void) {
        let entry = CountryEntry(date: .now, snapshot: loadSnapshot())
        let timeline = Timeline(entries: [entry], policy: .never)
        completion(timeline)
    }

    private func loadSnapshot() -> WidgetSnapshot {
        guard
            let defaults = UserDefaults(suiteName: appGroupID),
            let jsonString = defaults.string(forKey: snapshotKey),
            let data = jsonString.data(using: .utf8)
        else {
            return .empty
        }
        do {
            return try JSONDecoder().decode(WidgetSnapshot.self, from: data)
        } catch {
            return .empty
        }
    }
}
