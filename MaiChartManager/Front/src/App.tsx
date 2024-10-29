import { defineComponent } from 'vue';
import { dateZhCN, NConfigProvider, NDialogProvider, NMessageProvider, NNotificationProvider, zhCN } from 'naive-ui';
import FeedbackErrorDialog from "@/components/FeedbackErrorDialog";
import NeedPurchaseDialog from "@/components/NeedPurchaseDialog";
import Index from "@/views/Index";

export default defineComponent({
  render() {
    return (
      <NConfigProvider locale={zhCN} dateLocale={dateZhCN}>
        <NNotificationProvider>
          <NDialogProvider>
            <NMessageProvider>
              <Index/>
              <FeedbackErrorDialog/>
              <NeedPurchaseDialog/>
            </NMessageProvider>
          </NDialogProvider>
        </NNotificationProvider>
      </NConfigProvider>
    );
  },
});
