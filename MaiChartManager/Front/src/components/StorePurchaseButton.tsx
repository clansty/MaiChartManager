import { defineComponent } from "vue";
import { NButton, useDialog } from "naive-ui";
import api from "@/client/api";

export default defineComponent({
  setup(props) {
    const dialog = useDialog();

    const onClick = () => {
      if (location.hostname !== 'mcm.invalid') {
        dialog.info({
          title: '提示',
          content: '你需要在运行服务器端的设备上操作购买',
          positiveText: '继续',
          negativeText: '取消',
          onPositiveClick: () => {
            api.RequestPurchase()
          }
        });
      } else {
        api.RequestPurchase()
      }
    }

    return () => <NButton secondary onClick={onClick}>
      <span class="i-fluent-store-microsoft-16-filled text-lg mr-2"/>
      Microsoft Store
    </NButton>;
  }
})
