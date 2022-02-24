[@kurgm/kage-engine](../README.md) / Kage

# Class: Kage

## Table of contents

### Constructors

- [constructor](Kage.md#constructor)

### Properties

- [kBuhin](Kage.md#kbuhin)
- [kFont](Kage.md#kfont)
- [kGothic](Kage.md#kgothic)
- [kMincho](Kage.md#kmincho)
- [Buhin](Kage.md#buhin)
- [Polygons](Kage.md#polygons)

### Accessors

- [kShotai](Kage.md#kshotai)
- [kUseCurve](Kage.md#kusecurve)

### Methods

- [makeGlyph](Kage.md#makeglyph)
- [makeGlyph2](Kage.md#makeglyph2)
- [makeGlyph3](Kage.md#makeglyph3)
- [makeGlyphSeparated](Kage.md#makeglyphseparated)

## Constructors

### constructor

• **new Kage**(`size?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `size?` | `number` |

#### Defined in

[kage.ts:61](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L61)

## Properties

### kBuhin

• **kBuhin**: [`Buhin`](Buhin.md)

A storage from which components are looked up.

#### Defined in

[kage.ts:55](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L55)

___

### kFont

• **kFont**: [`Font`](../README.md#font)

Provides the way to configure parameters of the currently selected font.
Its parameters are reset to the default values when [Kage.kShotai](Kage.md#kshotai) is set.

**`example`**
```ts
const kage = new Kage();
kage.kFont.kRate = 50;
kage.kFont.kWidth = 3;
```

#### Defined in

[kage.ts:25](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L25)

___

### kGothic

• `Readonly` **kGothic**: [`kGothic`](../enums/KShotai.md#kgothic) = `KShotai.kGothic`

**`see`** [Kage.kFont](Kage.md#kfont)

#### Defined in

[kage.ts:13](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L13)

___

### kMincho

• `Readonly` **kMincho**: [`kMincho`](../enums/KShotai.md#kmincho) = `KShotai.kMincho`

**`see`** [Kage.kFont](Kage.md#kfont)

#### Defined in

[kage.ts:11](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L11)

___

### Buhin

▪ `Static` `Readonly` **Buhin**: typeof [`Buhin`](Buhin.md) = `Buhin`

#### Defined in

[kage.ts:7](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L7)

___

### Polygons

▪ `Static` `Readonly` **Polygons**: typeof [`Polygons`](Polygons.md) = `Polygons`

#### Defined in

[kage.ts:8](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L8)

## Accessors

### kShotai

• `get` **kShotai**(): [`KShotai`](../enums/KShotai.md)

Gets or sets the font as [KShotai](../enums/KShotai.md). Setting this property resets all the
font parameters in [Kage.kFont](Kage.md#kfont).

**`example`**
```ts
const kage = new Kage();
kage.kShotai = kage.kGothic;
```

#### Returns

[`KShotai`](../enums/KShotai.md)

#### Defined in

[kage.ts:37](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L37)

• `set` **kShotai**(`shotai`): `void`

Gets or sets the font as [KShotai](../enums/KShotai.md). Setting this property resets all the
font parameters in [Kage.kFont](Kage.md#kfont).

**`example`**
```ts
const kage = new Kage();
kage.kShotai = kage.kGothic;
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `shotai` | [`KShotai`](../enums/KShotai.md) |

#### Returns

`void`

#### Defined in

[kage.ts:40](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L40)

___

### kUseCurve

• `get` **kUseCurve**(): `boolean`

Whether to render the glyph with contours with off-curve points.

#### Returns

`boolean`

#### Defined in

[kage.ts:47](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L47)

• `set` **kUseCurve**(`value`): `void`

Whether to render the glyph with contours with off-curve points.

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `boolean` |

#### Returns

`void`

#### Defined in

[kage.ts:50](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L50)

## Methods

### makeGlyph

▸ **makeGlyph**(`polygons`, `buhin`): `void`

Renders the glyph of the given name. Existing data in `polygons` (if any) are
NOT cleared; new glyph is "overprinted".

**`example`**
```ts
const kage = new Kage();
kage.kBuhin.push("uXXXX", "1:0:2:32:31:176:31$2:22:7:176:31:170:43:156:63");
const polygons = new Polygons();
kage.makeGlyph(polygons, "uXXXX");
const svg = polygons.generateSVG(); // now `svg` has the string of the rendered glyph
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `polygons` | [`Polygons`](Polygons.md) | A [Polygons](Kage.md#polygons) instance on which the glyph is rendered. |
| `buhin` | `string` | The name of the glyph to be rendered. |

#### Returns

`void`

#### Defined in

[kage.ts:81](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L81)

___

### makeGlyph2

▸ **makeGlyph2**(`polygons`, `data`): `void`

Renders the glyph of the given KAGE data. Existing data in `polygons` (if any) are
NOT cleared; new glyph is "overprinted".

**`example`**
```ts
const kage = new Kage();
const polygons = new Polygons();
kage.makeGlyph2(polygons, "1:0:2:32:31:176:31$2:22:7:176:31:170:43:156:63");
const svg = polygons.generateSVG(); // now `svg` has the string of the rendered glyph
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `polygons` | [`Polygons`](Polygons.md) | A [Polygons](Kage.md#polygons) instance on which the glyph is rendered. |
| `data` | `string` | The KAGE data to be rendered (in which lines are delimited by `"$"`). |

#### Returns

`void`

#### Defined in

[kage.ts:99](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L99)

___

### makeGlyph3

▸ **makeGlyph3**(`data`): [`Polygons`](Polygons.md)[]

Renders each stroke of the given KAGE data on separate instances of
[Polygons](Kage.md#polygons).

**`example`**
```ts
const kage = new Kage();
const array = kage.makeGlyph3("1:0:2:32:31:176:31$2:22:7:176:31:170:43:156:63");
console.log(array.length); // => 2
console.log(array[0] instanceof Polygons); // => true
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `string` | The KAGE data to be rendered (in which lines are delimited by `"$"`). |

#### Returns

[`Polygons`](Polygons.md)[]

An array of [Polygons](Kage.md#polygons) instances holding the rendered data
    of each stroke in the glyph.

#### Defined in

[kage.ts:123](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L123)

___

### makeGlyphSeparated

▸ **makeGlyphSeparated**(`data`): [`Polygons`](Polygons.md)[]

Renders each KAGE data fragment in the given array on separate instances of
[Polygons](Kage.md#polygons), with stroke parameters adjusted as if all the fragments joined
together compose a single glyph.

**`example`**
```ts
const kage = new Kage();
const array = kage.makeGlyphSeparated([
	"2:7:8:31:16:32:53:16:65",
	"1:2:2:32:31:176:31$2:22:7:176:31:170:43:156:63",
]);
console.log(array.length); // => 2
console.log(array[0] instanceof Polygons); // => true
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `string`[] | An array of KAGE data fragments (in which lines are delimited by `"$"`)     to be rendered. |

#### Returns

[`Polygons`](Polygons.md)[]

An array of [Polygons](Kage.md#polygons) instances holding the rendered data
    of each KAGE data fragment.

#### Defined in

[kage.ts:157](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L157)
