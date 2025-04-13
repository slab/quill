import { Registry, RegistryDefinition, BlotConstructor, Attributor, Scope } from "parchment";

class ParchmentError extends Error {
  message: string;
  name: string;
  stack!: string;

  constructor(message: string) {
    message = '[ForkedParchment] ' + message;
    super(message);
    this.message = message;
    this.name = this.constructor.name;
  }
}

export class ForkedRegistry extends Registry {
  #attributes: { [key: string]: Attributor } = {};
  #classes: { [key: string]: BlotConstructor } = {};
  #tags: { [key: string]: BlotConstructor } = {};
  #types: { [key: string]: RegistryDefinition } = {};

  constructor(
    public parent: Registry
  ) {
    super();
  }

  override register(...definitions: RegistryDefinition[]): RegistryDefinition[] {
    return definitions.map((definition) => {
      const isBlot = 'blotName' in definition;
      const isAttr = 'attrName' in definition;
      if (!isBlot && !isAttr) {
        throw new ParchmentError('Invalid definition');
      } else if (isBlot && definition.blotName === 'abstract') {
        throw new ParchmentError('Cannot register abstract class');
      }
      const key = isBlot
        ? definition.blotName
        : isAttr
          ? definition.attrName
          : (undefined as never); // already handled by above checks
      this.#types[key] = definition;

      if (isAttr) {
        if (typeof definition.keyName === 'string') {
          this.#attributes[definition.keyName] = definition;
        }
      } else if (isBlot) {
        if (definition.className) {
          this.#classes[definition.className] = definition;
        }
        if (definition.tagName) {
          if (Array.isArray(definition.tagName)) {
            definition.tagName = definition.tagName.map((tagName: string) => {
              return tagName.toUpperCase();
            });
          } else {
            definition.tagName = definition.tagName.toUpperCase();
          }
          const tagNames = Array.isArray(definition.tagName)
            ? definition.tagName
            : [definition.tagName];
          tagNames.forEach((tag: string) => {
            if (this.#tags[tag] == null || definition.className == null) {
              this.#tags[tag] = definition;
            }
          });
        }
      }
      return definition;
    });
  }

  query(
    query: string | Node | Scope,
    scope: Scope = Scope.ANY,
  ): RegistryDefinition | null {
    const local = this.#queryLocal(query, scope);
    if (local) {
      return local;
    }

    return this.parent.query(query, scope);
  }

  #queryLocal(
    query: string | Node | Scope,
    scope: Scope = Scope.ANY,
  ): RegistryDefinition | null {
    let match;
    if (typeof query === 'string') {
      match = this.#types[query] || this.#attributes[query];
      // @ts-expect-error Fix me later
    } else if (query instanceof Text || query.nodeType === Node.TEXT_NODE) {
      match = this.#types.text;
    } else if (typeof query === 'number') {
      if (query & Scope.LEVEL & Scope.BLOCK) {
        match = this.#types.block;
      } else if (query & Scope.LEVEL & Scope.INLINE) {
        match = this.#types.inline;
      }
    } else if (query instanceof Element) {
      const names = (query.getAttribute('class') || '').split(/\s+/);
      names.some((name) => {
        match = this.#classes[name];
        if (match) {
          return true;
        }
        return false;
      });
      match = match || this.#tags[query.tagName];
    }
    if (match == null) {
      return null;
    }
    if (
      'scope' in match &&
      scope & Scope.LEVEL & match.scope &&
      scope & Scope.TYPE & match.scope
    ) {
      return match;
    }
    return null;
  }
}
