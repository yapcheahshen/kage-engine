[@kurgm/kage-engine](../README.md) / Buhin

# Class: Buhin

A key-value store that maps a glyph name to a string of KAGE data.

## Table of contents

### Constructors

- [constructor](Buhin.md#constructor)

### Methods

- [push](Buhin.md#push)
- [search](Buhin.md#search)
- [set](Buhin.md#set)

## Constructors

### constructor

• **new Buhin**()

#### Defined in

[buhin.ts:8](https://github.com/kurgm/kage-engine/blob/master/src/buhin.ts#L8)

## Methods

### push

▸ **push**(`name`, `data`): `void`

Adds or updates and element with a given glyph name and KAGE data.
It is an alias of [set](Buhin.md#set) method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The name of the glyph. |
| `data` | `string` | The KAGE data. |

#### Returns

`void`

#### Defined in

[buhin.ts:43](https://github.com/kurgm/kage-engine/blob/master/src/buhin.ts#L43)

___

### search

▸ **search**(`name`): `string`

Search the store for a specified glyph name and returns the corresponding
KAGE data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The name of the glyph to be looked up. |

#### Returns

`string`

The KAGE data if found, or an empty string if not found.

#### Defined in

[buhin.ts:30](https://github.com/kurgm/kage-engine/blob/master/src/buhin.ts#L30)

___

### set

▸ **set**(`name`, `data`): `void`

Adds or updates an element with a given glyph name and KAGE data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The name of the glyph. |
| `data` | `string` | The KAGE data. |

#### Returns

`void`

#### Defined in

[buhin.ts:20](https://github.com/kurgm/kage-engine/blob/master/src/buhin.ts#L20)
