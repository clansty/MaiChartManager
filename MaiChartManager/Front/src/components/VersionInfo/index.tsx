import { computed, defineComponent, onMounted, ref } from "vue";
import { AppLicenseDto, AppVersionResult } from "@/client/apiGen";
import api from "@/client/api";
import { NButton, NFlex, NModal, NPopover, NQrCode, NTime } from "naive-ui";
import '@fontsource/nerko-one'
import { version } from "@/store/refs";
import StorePurchaseButton from "@/components/VersionInfo/StorePurchaseButton";
import AfdianIcon from "@/icons/afdian.svg";

export default defineComponent({
  setup(props) {
    const show = ref(false);
    const displayVersion = computed(() => version.value?.version?.split('+')[0]);
    const licenseInfo = ref<AppLicenseDto>();

    onMounted(async () => {
      licenseInfo.value = (await api.GetAppLicenseStatus()).data;
    })

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
          {licenseInfo.value && licenseInfo.value.isPurchased && <NFlex align="center">
            感谢你的支持！
          </NFlex>}
          {licenseInfo.value && !licenseInfo.value.isPurchased && <NFlex align="center">
            赞助以帮助开发并获取更多功能（目前是期货）
            <StorePurchaseButton/>
            <NButton secondary onClick={() => window.open("https://afdian.com/item/90b4d1fe70e211efab3052540025c377")}>
              <span class="text-lg c-#946ce6 mr-2 translate-y-.25">
                <AfdianIcon/>
              </span>
              爱发电
            </NButton>
          </NFlex>}
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
