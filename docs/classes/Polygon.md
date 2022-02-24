[@kurgm/kage-engine](../README.md) / Polygon

# Class: Polygon

Represents a single contour of a rendered glyph.

It internally maintains the coordinate values with original precision as
set by the constructor, [set](Polygon.md#set), [push](Polygon.md#push) or [unshift](Polygon.md#unshift) methods,
but the [array](Polygon.md#array) getter or [get](Polygon.md#get) method returns the values rounded
to the first decimal place toward -infinity (for backward compatibility).

## Table of contents

### Constructors

- [constructor](Polygon.md#constructor)

### Accessors

- [array](Polygon.md#array)
- [length](Polygon.md#length)

### Methods

- [clone](Polygon.md#clone)
- [concat](Polygon.md#concat)
- [get](Polygon.md#get)
- [push](Polygon.md#push)
- [reverse](Polygon.md#reverse)
- [set](Polygon.md#set)
- [shift](Polygon.md#shift)
- [unshift](Polygon.md#unshift)

## Constructors

### constructor

• **new Polygon**(`length?`)

Construct the `Polygon` object. If the argument `length` is given,
constructed object has contour of size `length` whose members are all
initialized to the origin point (0, 0). Otherwise the contour has
no points.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `length?` | `number` | The initial number of points in the contour. |

#### Defined in

[polygon.ts:81](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L81)

• **new Polygon**(`points`)

Construct the `Polygon` object with the given points as its contour.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `points` | [`PointOptOff`](../README.md#pointoptoff)[] | The points in the contour. |

#### Defined in

[polygon.ts:86](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L86)

## Accessors

### array

• `get` **array**(): readonly `Readonly`<[`Point`](../interfaces/Point.md)\>[]

A read-only array consisting of the points in this contour.

Modifications to this array do NOT affect the contour;
call [set](Polygon.md#set) method to modify the contour.

**`example`**
```ts
for (const point of polygons.array) {
	// ...
}
```

Note that computation of rounded coordinates of all the points is performed
every time this property is accessed. To get a better performance, consider
caching the result in a variable when you need to access the array repeatedly.
```ts
// DO:
const array = polygon.array;
for (let i = 0; i < array.length; i++) {
	const point = array[i];
	// ...
}

// DON'T:
for (let i = 0; i < polygon.array.length; i++) {
	const point = polygon.array[i];
	// ...
}
```

**`see`** [Polygon.length](Polygon.md#length) is faster if you only need the length.

**`see`** [Polygon.get](Polygon.md#get) is faster if you need just one element.

#### Returns

readonly `Readonly`<[`Point`](../interfaces/Point.md)\>[]

#### Defined in

[polygon.ts:65](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L65)

___

### length

• `get` **length**(): `number`

The number of points in this contour.

#### Returns

`number`

#### Defined in

[polygon.ts:70](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L70)

## Methods

### clone

▸ **clone**(): [`Polygon`](Polygon.md)

Creates a deep copy of this Polygon.

#### Returns

[`Polygon`](Polygon.md)

A new [Polygon](Polygon.md) instance.

#### Defined in

[polygon.ts:215](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L215)

___

### concat

▸ **concat**(`poly`): `void`

Appends the points in the contour of another [Polygon](Polygon.md) at the end of
this contour. The other Polygon is not mutated.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `poly` | [`Polygon`](Polygon.md) | The other [Polygon](Polygon.md) to be appended. |

#### Returns

`void`

#### Defined in

[polygon.ts:188](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L188)

___

### get

▸ **get**(`index`): `Readonly`<[`Point`](../interfaces/Point.md)\>

Retrieves a point in its contour. If the index is out of bounds,
throws an error.

**`example`**
```ts
for (let i = 0; i < polygon.length; i++) {
	const point = polygon.get(i);
	// ...
}
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `index` | `number` | The index in the contour of the point to be retrieved. |

#### Returns

`Readonly`<[`Point`](../interfaces/Point.md)\>

A read-only point object. Modifications made to the returned
    object do NOT affect the values of the point in the contour;
    call [set](Polygon.md#set) method to modify the contour.

#### Defined in

[polygon.ts:167](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L167)

___

### push

▸ **push**(`x`, `y`, `off?`): `void`

Appends a point at the end of its contour.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `x` | `number` | `undefined` | The x-coordinate of the appended point. |
| `y` | `number` | `undefined` | The y-coordiante of the appended point. |
| `off` | `boolean` | `false` | Whether the appended point is an off-curve point. Defaults to `false`. |

#### Returns

`void`

#### Defined in

[polygon.ts:112](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L112)

___

### reverse

▸ **reverse**(): `void`

Reverses the points in its contour.

#### Returns

`void`

#### Defined in

[polygon.ts:179](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L179)

___

### set

▸ **set**(`index`, `x`, `y`, `off?`): `void`

Mutates a point in its contour.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `index` | `number` | `undefined` | The index in the contour of the point to be mutated. |
| `x` | `number` | `undefined` | The new x-coordinate of the point. |
| `y` | `number` | `undefined` | The new y-coordinate of the point. |
| `off` | `boolean` | `false` | Whether the new point is an off-curve point. Defaults to `false`. |

#### Returns

`void`

#### Defined in

[polygon.ts:133](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L133)

___

### shift

▸ **shift**(): `void`

Removes the first point in its contour. If there are no points in the contour,
nothing is performed.

#### Returns

`void`

#### Defined in

[polygon.ts:196](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L196)

___

### unshift

▸ **unshift**(`x`, `y`, `off?`): `void`

Inserts a new point at the start of its contour.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `x` | `number` | `undefined` | The x-coordinate of the inserted point. |
| `y` | `number` | `undefined` | The y-coordiante of the inserted point. |
| `off` | `boolean` | `false` | Whether the inserted point is an off-curve point. Defaults to `false`. |

#### Returns

`void`

#### Defined in

[polygon.ts:206](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L206)
