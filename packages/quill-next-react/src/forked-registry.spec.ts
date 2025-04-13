import { describe, it, expect } from "vitest";
import Quill from "quill-next";
import { BlockBlot } from "parchment";
import { ForkedRegistry } from "./forked-registry";

describe("ForkedRegistry", () => {

  it("create", () => {
    const global = Quill.DEFAULTS.registry;
    const forked = new ForkedRegistry(global);
    expect(forked.query("blots/block")).toBe(global.query("blots/block"));
  });

  it("register custom blot", () => {
    class CustomBlot extends BlockBlot {
      static blotName: string = "custom";
      static create(value: string) {
        const node = super.create(value);
        node.setAttribute("data-custom", value);
        return node;
      }
    }

    const global = Quill.DEFAULTS.registry;
    const forked = new ForkedRegistry(global);

    forked.register(CustomBlot)

    expect(forked.query("custom")).toBe(CustomBlot);
  })
});
