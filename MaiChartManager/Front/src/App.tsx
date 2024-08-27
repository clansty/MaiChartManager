import { defineComponent } from 'vue';
import { dateZhCN, NConfigProvider, NDialogProvider, NNotificationProvider, zhCN } from 'naive-ui';
import { RouterView } from 'vue-router';

export default defineComponent({
  render() {
    return (
      <NConfigProvider locale={zhCN} dateLocale={dateZhCN}>
        <NNotificationProvider>
          <NDialogProvider>
            <RouterView/>
          </NDialogProvider>
        </NNotificationProvider>
      </NConfigProvider>
    );
  },
});
