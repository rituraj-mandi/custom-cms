import { supabase } from "@/lib/supabase";

export default class AudioTool {
  data: any;

  wrapper: HTMLElement;

  input!: HTMLInputElement;

  constructor({
    data,
  }: {
    data: any;
  }) {
    this.data = data || {};
    this.wrapper =
      document.createElement("div");
  }

  static get toolbox() {
    return {
      title: "Audio",
      icon: "🎵",
    };
  }

  render() {
    this.wrapper.classList.add(
      "space-y-4"
    );

    if (this.data.url) {
      this.wrapper.innerHTML = `
        <audio
          controls
          class="w-full"
        >
          <source src="${this.data.url}" />
        </audio>
      `;

      return this.wrapper;
    }

    this.input =
      document.createElement("input");

    this.input.type = "file";

    this.input.accept = "audio/*";

    const statusEl = document.createElement("p");
    statusEl.style.fontSize = "0.875rem";
    statusEl.style.color = "#a1a1aa";

    this.input.addEventListener(
      "change",
      async (event: any) => {
        const file =
          event.target.files[0];

        if (!file) return;

        statusEl.textContent = "Uploading...";
        this.wrapper.appendChild(statusEl);

        const fileExt =
          file.name.split(".").pop();

        const fileName = `uploads/${Date.now()}.${fileExt}`;

        const { error } =
          await supabase.storage
            .from("media")
            .upload(fileName, file);

        if (error) {
          statusEl.textContent = `Upload failed: ${error.message}`;
          console.error(error);
          return;
        }

        const { data } =
          supabase.storage
            .from("media")
            .getPublicUrl(fileName);

        this.data.url = data.publicUrl;

        this.wrapper.innerHTML = `
          <audio
            controls
            class="w-full"
          >
            <source src="${data.publicUrl}" />
          </audio>
        `;
      }
    );

    this.wrapper.appendChild(this.input);

    return this.wrapper;
  }

  save() {
    return {
      url: this.data.url,
    };
  }
}