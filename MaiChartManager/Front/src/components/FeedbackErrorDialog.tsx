import { computed, defineComponent, ref, watch } from "vue";
import { NButton, NFlex, NFormItem, NInput, NModal, useMessage } from "naive-ui";
import { error, errorContext, errorId } from "@/store/refs";
import { captureFeedback } from "@sentry/vue";

export default defineComponent({
  setup(props) {
    const nMessage = useMessage();

    const message = computed(() => {
      if (!error.value) return "";
      if (error.value.error) {
        return error.value.error.message || error.value.error.toString();
      }
      if (error.value.message) {
        return error.value.message;
      }
      return error.value.toString();
    })

    const userInput = ref("");

    watch(() => error.value, (v, old) => {
      // 防止输入到一半出另一个错误清空输入
      if (old) return;
      userInput.value = "";
    });

    const report = () => {
      captureFeedback({
        associatedEventId: errorId.value,
        message: userInput.value || "无",
      })
      nMessage.success("感谢大佬的反馈！");
      error.value = null;
    }

    return () => <NModal
      preset="card"
      class="w-[min(50vw,60em)]"
      title="出错了！"
      show={!!error.value}
      onUpdateShow={() => error.value = null}
    >
      {{
        default: () => <NFlex vertical size="large">
          <div class="text-lg">{errorContext.value}</div>
          {message.value}
          <NInput v-model:value={userInput.value} class="w-full" type="textarea" placeholder="可以提供一下相关背景和上下文吗？比如说你的游戏或者乐曲有没有什么特别之处"/>
        </NFlex>,
        footer: () => <NFlex justify="end">
          <NButton onClick={report}>发送反馈</NButton>
        </NFlex>
      }}
    </NModal>;
  }
})
