import { defineComponent } from "vue";
import { NButton, NFlex, NModal, NPopover, NQrCode } from "naive-ui";
import { showNeedPurchaseDialog } from "@/store/refs";
import StorePurchaseButton from "@/components/StorePurchaseButton";
import AfdianIcon from "@/icons/afdian.svg";

export default defineComponent({
  setup(props) {
    return () => <NModal
      preset="card"
      class="w-[min(50vw,60em)]"
      title="赞助版功能"
      v-model:show={showNeedPurchaseDialog.value}
    >
      <NFlex vertical>
        <div>
          此功能为赞助版功能，赞助版用户可永久使用
        </div>
        <div>
          目前已推出的赞助版功能包括：
        </div>
        <ul>
          <li>转换 PV</li>
          <li>设置音频的预览片段</li>
          <li>修改歌曲 ID</li>
          <li>批量将乐曲导出成新的 Opt</li>
          <li>批量将乐曲转换成 Maidata</li>
        </ul>
        <div>更多功能敬请期待</div>
        <NFlex align="center">
          赞助以帮助开发并获取更多功能
          <StorePurchaseButton/>
          <NButton secondary onClick={() => window.open("https://afdian.com/item/90b4d1fe70e211efab3052540025c377")}>
              <span class="text-lg c-#946ce6 mr-2 translate-y-.25">
                <AfdianIcon/>
              </span>
            爱发电
          </NButton>
          <NPopover trigger="click">
            {{
              trigger: () => <NButton secondary>
              <span class="text-lg i-ri-qq-fill c-gray-6 mr-1 translate-y-.12">
                <AfdianIcon/>
              </span>
                QQ 群
              </NButton>,
              default: () => <div><NQrCode value="https://qm.qq.com/q/xA4HgfhIM8"/></div>
            }}
          </NPopover>
        </NFlex>
      </NFlex>
    </NModal>;
  }
})
