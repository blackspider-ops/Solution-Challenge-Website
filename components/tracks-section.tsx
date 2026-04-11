import { getVisibleTracks } from "@/lib/actions/tracks"
import { TracksGrid } from "./tracks-grid"

export async function TracksSection() {
  const tracks = await getVisibleTracks();
  return (
    <section id="tracks" className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted/50 via-muted/30 to-background" />

      <div className="max-w-7xl mx-auto">
        <TracksGrid tracks={tracks} />
      </div>
    </section>
  )
}
