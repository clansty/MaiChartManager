import { computed, defineComponent, onMounted, ref } from "vue";
import { AppVersionResult } from "@/client/apiGen";
import api from "@/client/api";
import { NButton, NFlex, NModal, NPopover, NQrCode, NTime } from "naive-ui";
import '@fontsource/nerko-one'
import { version } from "@/store/refs";

export default defineComponent({
  setup(props) {
    const show = ref(false);
    const displayVersion = computed(() => version.value?.version?.split('+')[0]);

    return () => version.value && <NButton quaternary round onClick={() => show.value = true}>
      v{displayVersion.value}

      <NModal
        preset="card"
        class="w-[min(45vw,60em)]"
        title="关于"
        v-model:show={show.value}
      >
        <NFlex vertical class="text-4" size="large">
          <AppIcon class="mb-6"/>
          <div class="flex justify-center gap-1 text-10 c-gray-4">
            <a class="i-mdi-github hover:c-#1f2328 transition-300" href="https://github.com/clansty/MaiChartManager" target="_blank"/>
            <a class="i-ic-baseline-telegram hover:c-#39a6e6 transition-300" href="https://t.me/MaiChartManager" target="_blank"/>
            <NPopover trigger="hover">
              {{
                trigger: () => <div class="i-ri-qq-fill hover:c-#e31b25 transition-300"/>,
                default: () => <div><NQrCode value="https://qm.qq.com/q/xA4HgfhIM8"/></div>
              }}
            </NPopover>
          </div>
          <div>
            版本: {version.value.version}
          </div>
          <div>
            游戏版本: 1.{version.value.gameVersion}
          </div>
        </NFlex>
      </NModal>
    </NButton>;
  }
})

const AppIcon = defineComponent({
  setup() {
    return () => <div class="flex flex-col items-center font-['Nerko_One'] text-30 text-stroke-2 lh-none">
      <NFlex>
        <div class="c-#c3c4f8 text-stroke-#8791e2">
          Mai
        </div>
        <div class="c-#f7abca text-stroke-#d079b2">
          Chart
        </div>
      </NFlex>
      <div class="c-#fef19d text-stroke-#e3c86a">
        Manager
      </div>
    </div>
  }
})
