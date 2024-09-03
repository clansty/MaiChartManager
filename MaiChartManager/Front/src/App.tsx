import { defineComponent } from 'vue';
import { dateZhCN, NConfigProvider, NDialogProvider, NMessageProvider, NNotificationProvider, zhCN } from 'naive-ui';
import { RouterView } from 'vue-router';
import FeedbackErrorDialog from "@/components/FeedbackErrorDialog";

export default defineComponent({
  render() {
    return (
      <NConfigProvider locale={zhCN} dateLocale={dateZhCN}>
        <NNotificationProvider>
          <NDialogProvider>
            <NMessageProvider>
              <RouterView/>
              <FeedbackErrorDialog/>
            </NMessageProvider>
          </NDialogProvider>
        </NNotificationProvider>
      </NConfigProvider>
    );
  },
});
