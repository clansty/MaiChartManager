import { defineComponent } from 'vue';
import {NGi, NGrid} from "naive-ui";
import MusicList from "@/components/MusicList";

export default defineComponent({
  render() {
    return <NGrid cols={3}>
      <NGi class="p-xy h-100vh">
        <MusicList/>
      </NGi>
      <NGi class="p-xy max-h-100vh of-auto" span={2}>

      </NGi>
    </NGrid>;
  },
});
