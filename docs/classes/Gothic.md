[@kurgm/kage-engine](../README.md) / Gothic

# Class: Gothic

Gothic style font.

## Hierarchy

- [`Mincho`](Mincho.md)

  ↳ **`Gothic`**

## Implements

- `FontInterface`

## Table of contents

### Constructors

- [constructor](Gothic.md#constructor)

### Properties

- [kAdjustKakatoL](Gothic.md#kadjustkakatol)
- [kAdjustKakatoR](Gothic.md#kadjustkakator)
- [kAdjustKakatoRangeX](Gothic.md#kadjustkakatorangex)
- [kAdjustKakatoRangeY](Gothic.md#kadjustkakatorangey)
- [kAdjustKakatoStep](Gothic.md#kadjustkakatostep)
- [kAdjustMageStep](Gothic.md#kadjustmagestep)
- [kAdjustTateStep](Gothic.md#kadjusttatestep)
- [kAdjustUroko2Length](Gothic.md#kadjusturoko2length)
- [kAdjustUroko2Step](Gothic.md#kadjusturoko2step)
- [kAdjustUrokoLength](Gothic.md#kadjusturokolength)
- [kAdjustUrokoLengthStep](Gothic.md#kadjusturokolengthstep)
- [kAdjustUrokoLine](Gothic.md#kadjusturokoline)
- [kAdjustUrokoX](Gothic.md#kadjusturokox)
- [kAdjustUrokoY](Gothic.md#kadjusturokoy)
- [kKakato](Gothic.md#kkakato)
- [kL2RDfatten](Gothic.md#kl2rdfatten)
- [kMage](Gothic.md#kmage)
- [kMinWidthT](Gothic.md#kminwidtht)
- [kMinWidthU](Gothic.md#kminwidthu)
- [kMinWidthY](Gothic.md#kminwidthy)
- [kRate](Gothic.md#krate)
- [kUseCurve](Gothic.md#kusecurve)
- [kWidth](Gothic.md#kwidth)
- [shotai](Gothic.md#shotai)

### Methods

- [setSize](Gothic.md#setsize)

## Constructors

### constructor

• **new Gothic**()

#### Inherited from

[Mincho](Mincho.md).[constructor](Mincho.md#constructor)

#### Defined in

[font/mincho/index.ts:289](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L289)

## Properties

### kAdjustKakatoL

• **kAdjustKakatoL**: `number`[]

Length of 左下カド's カカト in mincho for each shortening level (0 to 3) and 413 (左下zh用新).

#### Inherited from

[Mincho](Mincho.md).[kAdjustKakatoL](Mincho.md#kadjustkakatol)

#### Defined in

[font/mincho/index.ts:250](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L250)

___

### kAdjustKakatoR

• **kAdjustKakatoR**: `number`[]

Length of 右下カド's カカト in mincho for each shortening level (0 to 3).

#### Inherited from

[Mincho](Mincho.md).[kAdjustKakatoR](Mincho.md#kadjustkakator)

#### Defined in

[font/mincho/index.ts:253](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L253)

___

### kAdjustKakatoRangeX

• **kAdjustKakatoRangeX**: `number`

Width of the collision box below カカト for shortening adjustment.

#### Inherited from

[Mincho](Mincho.md).[kAdjustKakatoRangeX](Mincho.md#kadjustkakatorangex)

#### Defined in

[font/mincho/index.ts:256](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L256)

___

### kAdjustKakatoRangeY

• **kAdjustKakatoRangeY**: `number`[]

Height of the collision box below カカト for each shortening adjustment level (0 to 3).

#### Inherited from

[Mincho](Mincho.md).[kAdjustKakatoRangeY](Mincho.md#kadjustkakatorangey)

#### Defined in

[font/mincho/index.ts:259](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L259)

___

### kAdjustKakatoStep

• **kAdjustKakatoStep**: `number`

Number of カカト shortening levels. Must be set to 3.

#### Inherited from

[Mincho](Mincho.md).[kAdjustKakatoStep](Mincho.md#kadjustkakatostep)

#### Defined in

[font/mincho/index.ts:262](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L262)

___

### kAdjustMageStep

• **kAdjustMageStep**: `number`

Parameter for thinning adjustment of latter half of mincho-style 折れ strokes.

#### Inherited from

[Mincho](Mincho.md).[kAdjustMageStep](Mincho.md#kadjustmagestep)

#### Defined in

[font/mincho/index.ts:287](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L287)

___

### kAdjustTateStep

• **kAdjustTateStep**: `number`

Parameter for thinning adjustment of mincho-style vertical strokes.

#### Inherited from

[Mincho](Mincho.md).[kAdjustTateStep](Mincho.md#kadjusttatestep)

#### Defined in

[font/mincho/index.ts:285](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L285)

___

### kAdjustUroko2Length

• **kAdjustUroko2Length**: `number`

Parameter for shrinking adjustment of ウロコ using density of horizontal strokes.

#### Inherited from

[Mincho](Mincho.md).[kAdjustUroko2Length](Mincho.md#kadjusturoko2length)

#### Defined in

[font/mincho/index.ts:283](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L283)

___

### kAdjustUroko2Step

• **kAdjustUroko2Step**: `number`

Number of ウロコ shrinking levels by adjustment using density of horizontal strokes.

#### Inherited from

[Mincho](Mincho.md).[kAdjustUroko2Step](Mincho.md#kadjusturoko2step)

#### Defined in

[font/mincho/index.ts:281](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L281)

___

### kAdjustUrokoLength

• **kAdjustUrokoLength**: `number`[]

Threshold length of horizontal strokes for shrinking its ウロコ for each adjustment level ([kAdjustUrokoLengthStep](Gothic.md#kadjusturokolengthstep) to 1).

#### Inherited from

[Mincho](Mincho.md).[kAdjustUrokoLength](Mincho.md#kadjusturokolength)

#### Defined in

[font/mincho/index.ts:272](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L272)

___

### kAdjustUrokoLengthStep

• **kAdjustUrokoLengthStep**: `number`

Number of ウロコ shrinking levels by adjustment using collision detection.

#### Inherited from

[Mincho](Mincho.md).[kAdjustUrokoLengthStep](Mincho.md#kadjusturokolengthstep)

#### Defined in

[font/mincho/index.ts:275](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L275)

___

### kAdjustUrokoLine

• **kAdjustUrokoLine**: `number`[]

Size of the collision box to the left of ウロコ at the 開放 end of mincho-style horizontal strokes for each shrinking adjustment level ([kAdjustUrokoLengthStep](Gothic.md#kadjusturokolengthstep) to 1).

#### Inherited from

[Mincho](Mincho.md).[kAdjustUrokoLine](Mincho.md#kadjusturokoline)

#### Defined in

[font/mincho/index.ts:278](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L278)

___

### kAdjustUrokoX

• **kAdjustUrokoX**: `number`[]

Size of ウロコ at the 開放 end of mincho-style horizontal strokes for each shrinking level (0 to max([kAdjustUrokoLengthStep](Gothic.md#kadjusturokolengthstep), [kAdjustUroko2Step](Gothic.md#kadjusturoko2step))).

#### Inherited from

[Mincho](Mincho.md).[kAdjustUrokoX](Mincho.md#kadjusturokox)

#### Defined in

[font/mincho/index.ts:266](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L266)

___

### kAdjustUrokoY

• **kAdjustUrokoY**: `number`[]

Size of ウロコ at the 開放 end of mincho-style horizontal strokes for each shrinking level (0 to max([kAdjustUrokoLengthStep](Gothic.md#kadjusturokolengthstep), [kAdjustUroko2Step](Gothic.md#kadjusturoko2step))).

#### Inherited from

[Mincho](Mincho.md).[kAdjustUrokoY](Mincho.md#kadjusturokoy)

#### Defined in

[font/mincho/index.ts:269](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L269)

___

### kKakato

• **kKakato**: `number`

Size of カカト in gothic.

#### Inherited from

[Mincho](Mincho.md).[kKakato](Mincho.md#kkakato)

#### Defined in

[font/mincho/index.ts:237](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L237)

___

### kL2RDfatten

• **kL2RDfatten**: `number`

Width at the end of 右払い relative to `2 * kMinWidthT`.

#### Inherited from

[Mincho](Mincho.md).[kL2RDfatten](Mincho.md#kl2rdfatten)

#### Defined in

[font/mincho/index.ts:239](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L239)

___

### kMage

• **kMage**: `number`

Size of curve at the end of 左ハネ, and at the middle of 折れ and 乙線 strokes.

#### Inherited from

[Mincho](Mincho.md).[kMage](Mincho.md#kmage)

#### Defined in

[font/mincho/index.ts:241](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L241)

___

### kMinWidthT

• **kMinWidthT**: `number`

Half of the width of mincho-style vertical (thicker) strokes.

#### Inherited from

[Mincho](Mincho.md).[kMinWidthT](Mincho.md#kminwidtht)

#### Defined in

[font/mincho/index.ts:230](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L230)

___

### kMinWidthU

• **kMinWidthU**: `number`

Determines the size of ウロコ at the 開放 end of mincho-style horizontal strokes.

#### Inherited from

[Mincho](Mincho.md).[kMinWidthU](Mincho.md#kminwidthu)

#### Defined in

[font/mincho/index.ts:228](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L228)

___

### kMinWidthY

• **kMinWidthY**: `number`

Half of the width of mincho-style horizontal (thinner) strokes.

#### Inherited from

[Mincho](Mincho.md).[kMinWidthY](Mincho.md#kminwidthy)

#### Defined in

[font/mincho/index.ts:226](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L226)

___

### kRate

• **kRate**: `number` = `100`

Precision for polygon approximation of curving strokes.
It must be a positive divisor of 1000. The smaller `kRate` will give
smoother curves approximated with the larger number of points (roughly
2 × 1000 / `kRate` per one curve stroke).

#### Inherited from

[Mincho](Mincho.md).[kRate](Mincho.md#krate)

#### Defined in

[font/mincho/index.ts:224](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L224)

___

### kUseCurve

• **kUseCurve**: `boolean`

Whether to use off-curve points to approximate curving strokes
with quadratic Bézier curve (experimental).

#### Implementation of

FontInterface.kUseCurve

#### Inherited from

[Mincho](Mincho.md).[kUseCurve](Mincho.md#kusecurve)

#### Defined in

[font/mincho/index.ts:246](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L246)

___

### kWidth

• **kWidth**: `number`

Half of the width of gothic-style strokes.
Also used to determine the size of mincho's ornamental elements.

#### Inherited from

[Mincho](Mincho.md).[kWidth](Mincho.md#kwidth)

#### Defined in

[font/mincho/index.ts:235](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L235)

___

### shotai

• `Readonly` **shotai**: [`KShotai`](../enums/KShotai.md) = `KShotai.kGothic`

#### Implementation of

FontInterface.shotai

#### Overrides

[Mincho](Mincho.md).[shotai](Mincho.md#shotai)

#### Defined in

[font/gothic/index.ts:135](https://github.com/kurgm/kage-engine/blob/master/src/font/gothic/index.ts#L135)

## Methods

### setSize

▸ **setSize**(`size?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `size?` | `number` |

#### Returns

`void`

#### Implementation of

FontInterface.setSize

#### Inherited from

[Mincho](Mincho.md).[setSize](Mincho.md#setsize)

#### Defined in

[font/mincho/index.ts:293](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L293)
