import SwiftUI
import WidgetKit

struct CountryWidgetView: View {
    let entry: CountryEntry

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("최근 방문")
                .font(.caption)
                .foregroundColor(.secondary)

            if entry.snapshot.recent.isEmpty {
                Spacer()
                HStack {
                    Spacer()
                    Text("여행을 기록해보세요")
                        .font(.footnote)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                    Spacer()
                }
                Spacer()
            } else {
                ForEach(Array(entry.snapshot.recent.prefix(3))) { country in
                    HStack {
                        Text("\(country.flag) \(country.name)")
                            .font(.subheadline)
                            .lineLimit(1)
                        Spacer()
                        Text("\(country.days)일")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                }
                Spacer()
            }

            Text("총 \(entry.snapshot.totalCountries)개국 · \(entry.snapshot.totalDays)일")
                .font(.caption2)
                .foregroundColor(.secondary)
        }
        .padding(12)
        .widgetURL(URL(string: "country-tracker://home"))
    }
}
