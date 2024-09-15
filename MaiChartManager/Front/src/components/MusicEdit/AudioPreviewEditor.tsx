import { computed, defineComponent, onMounted, ref } from "vue";
import { NButton, NFlex, NModal } from "naive-ui";
import RegionsPlugin, { Region } from "wavesurfer.js/dist/plugins/regions";
import WaveSurfer from "wavesurfer.js";
import { globalCapture, selectMusicId } from "@/store/refs";
import ZoomPlugin from 'wavesurfer.js/dist/plugins/zoom'
import Hover from 'wavesurfer.js/dist/plugins/hover'
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline'
import api from "@/client/api";

export default defineComponent({
  props: {
    closeModel: {type: Function, required: true}
  },
  setup(props, {emit}) {
    const waveSurferContainer = ref()
    const region = ref<Region>()
    const ws = ref<WaveSurfer>()
    const isPlaying = ref(false)
    const isPlaySection = ref(false)

    onMounted(() => {
      const regions = RegionsPlugin.create()
      ws.value = WaveSurfer.create({
        container: waveSurferContainer.value,
        waveColor: 'rgb(107,203,152)',
        progressColor: 'rgb(33,194,118)',
        url: `/MaiChartManagerServlet/GetMusicWavApi/${selectMusicId.value}`,
        plugins: [
          regions,
          ZoomPlugin.create({
            scale: 0.05
          }),
          Hover.create({
            lineColor: 'rgba(89,89,89,0.8)',
          }),
          TimelinePlugin.create()
        ],
      })

      ws.value.on('decode', (duration) => {
        // Regions
        region.value = regions.addRegion({
          start: 0,
          end: duration,
          drag: true,
          resize: true,
          id: 'selection',
        })
      })

      regions.on("region-out", () => {
        if (isPlaySection.value)
          region.value?.play();
      })

      ws.value.on('finish', () => {
        isPlaying.value = false
      })
    })

    const load = ref(false)

    const save = async () => {
      load.value = true
      try {
        await api.SetAudioPreview(selectMusicId.value, {startTime: region.value!.start, endTime: region.value!.end})
        props.closeModel()
      } catch (e) {
        globalCapture(e, "保存音频预览失败")
      } finally {
        load.value = false
      }
    }

    const playIcon = computed(() => isPlaying.value ? 'i-mdi-pause' : 'i-mdi-play')

    return () => <NFlex vertical size="large">
      <div ref={waveSurferContainer}/>
      <NFlex justify="center">
        <NButton secondary onClick={() => {
          isPlaySection.value = false
          if (isPlaying.value) ws.value?.pause()
          else ws.value?.play()
          isPlaying.value = !isPlaying.value
        }}>
          <span class={`text-lg ${playIcon.value}`}/>
        </NButton>
        <NButton secondary onClick={() => {
          isPlaySection.value = true
          isPlaying.value = true
          region.value?.play()
        }}>
          <span class="i-mdi-play text-lg m-r-2"/>
          选区
        </NButton>
      </NFlex>
      <NFlex justify="end">
        <NButton secondary onClick={save} loading={load.value}>
          保存
        </NButton>
      </NFlex>
    </NFlex>;
  }
})
