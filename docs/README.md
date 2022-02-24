@kurgm/kage-engine

# @kurgm/kage-engine

## Table of contents

### References

- [default](README.md#default)

### Enumerations

- [KShotai](enums/KShotai.md)

### Classes

- [Buhin](classes/Buhin.md)
- [Gothic](classes/Gothic.md)
- [Kage](classes/Kage.md)
- [Mincho](classes/Mincho.md)
- [Polygon](classes/Polygon.md)
- [Polygons](classes/Polygons.md)

### Interfaces

- [Point](interfaces/Point.md)

### Type aliases

- [Font](README.md#font)
- [PointOptOff](README.md#pointoptoff)

## References

### default

Renames and re-exports [Kage](classes/Kage.md)

## Type aliases

### Font

Ƭ **Font**: [`Mincho`](classes/Mincho.md) \| [`Gothic`](classes/Gothic.md)

#### Defined in

[font/index.ts:23](https://github.com/kurgm/kage-engine/blob/master/src/font/index.ts#L23)

___

### PointOptOff

Ƭ **PointOptOff**: `Omit`<[`Point`](interfaces/Point.md), ``"off"``\> & `Partial`<`Pick`<[`Point`](interfaces/Point.md), ``"off"``\>\>

The same as [Point](interfaces/Point.md) except that the `off` property is optional.
When `off` is omitted, it is treated as an on-curve point (`off: false`).
Used as the parameter type of [Polygon](classes/Polygon.md)'s methods.

#### Defined in

[polygon.ts:19](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L19)
