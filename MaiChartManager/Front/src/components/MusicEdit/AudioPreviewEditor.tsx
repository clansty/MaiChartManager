import { computed, defineComponent, onMounted, ref } from "vue";
import { NButton, NFlex, NModal, NSpin, useMessage } from "naive-ui";
import RegionsPlugin, { Region } from "wavesurfer.js/dist/plugins/regions";
import WaveSurfer from "wavesurfer.js";
import { globalCapture, selectedADir, selectMusicId } from "@/store/refs";
import ZoomPlugin from 'wavesurfer.js/dist/plugins/zoom'
import Hover from 'wavesurfer.js/dist/plugins/hover'
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline'
import api, { getUrl } from "@/client/api";
import { AudioPreviewTime } from "@/client/apiGen";
import { useMagicKeys } from "@vueuse/core";

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
    const load = ref(false)
    const dataLoad = ref(true)
    const {ctrl, shift} = useMagicKeys()
    const message = useMessage()

    onMounted(async () => {
      dataLoad.value = true
      let savedRegion: AudioPreviewTime | null = null
      try {
        const req = await api.GetAudioPreviewTime(selectMusicId.value, selectedADir.value)
        savedRegion = req.data
        if (savedRegion.startTime! >= savedRegion.endTime!) {
          throw new Error("音频预览时间错误")
        }
      } catch (e) {
        savedRegion = {startTime: -1, endTime: -1}
      }

      const regions = RegionsPlugin.create()
      ws.value = WaveSurfer.create({
        container: waveSurferContainer.value,
        waveColor: 'rgb(107,203,152)',
        progressColor: 'rgb(33,194,118)',
        url: getUrl(`GetMusicWavApi/${selectedADir.value}/${selectMusicId.value}`),
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
          start: savedRegion!.startTime! >= 0 ? savedRegion.startTime! : 0,
          end: savedRegion!.endTime! >= 0 ? savedRegion.endTime! : duration,
          drag: true,
          resize: true,
          id: 'selection',
        })
      })

      ws.value.on('click', (e) => {
        const time = ws.value?.getDuration()! * e;
        if (ctrl.value) {
          if (time >= region.value!.end) {
            message.warning("开始时间不能大于结束时间")
            return
          }
          region.value!.setOptions({start: time})
        } else if (shift.value) {
          if (time <= region.value!.start) {
            message.warning("结束时间不能小于开始时间")
            return
          }
          region.value!.setOptions({end: time, start: region.value!.start})
        }
      })

      regions.on("region-out", () => {
        if (isPlaySection.value)
          region.value?.play();
      })

      ws.value.on('finish', () => {
        isPlaying.value = false
      })
      dataLoad.value = false
    })

    const save = async () => {
      load.value = true
      try {
        await api.SetAudioPreview(selectMusicId.value, selectedADir.value, {startTime: region.value!.start, endTime: region.value!.end})
        props.closeModel()
      } catch (e) {
        globalCapture(e, "保存音频预览失败")
      } finally {
        load.value = false
      }
    }

    const playIcon = computed(() => isPlaying.value ? 'i-mdi-pause' : 'i-mdi-play')

    return () => <NSpin show={dataLoad.value}>
      <NFlex vertical size="large">
        Ctrl / Shift + 点击可直接将点击位置设为开始 / 结束时间
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
          <NButton type="error" secondary onClick={props.closeModel as any} disabled={load.value}>
            放弃
          </NButton>
          <NButton secondary onClick={save} loading={load.value}>
            保存
          </NButton>
        </NFlex>
      </NFlex>
    </NSpin>;
  }
})
