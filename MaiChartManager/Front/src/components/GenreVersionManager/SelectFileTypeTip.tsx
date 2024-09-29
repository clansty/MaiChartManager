import { computed, defineComponent } from "vue";
import { NDrawer, NDrawerContent, NFlex } from "naive-ui";
import FileTypeIcon from "@/components/FileTypeIcon";
import FileContentIcon from "@/components/FileContentIcon";

export default defineComponent({
  props: {
    show: {type: Boolean, required: true},
  },
  setup(props, {emit}) {
    return () => <NDrawer show={props.show} height={250} placement="bottom">
      <NDrawerContent title="可以选择的文件类型">
        <NFlex vertical size="large">
          图片比例无所谓，但是最好是差不多那个比例的横向透明 PNG 图片。分辨率在 332x160 左右最好。
          <div class="grid cols-4 justify-items-center text-8em gap-10">
            <FileTypeIcon type="JPG"/>
            <FileTypeIcon type="PNG"/>
          </div>
        </NFlex>
      </NDrawerContent>
    </NDrawer>;
  }
})
