import { parseChildren } from '../../src/parser/parse-children';
import { Reader } from '../../src/parser/reader';
import { ElemSchema, LoopSchema, NodeTypes } from '../../src/types';

test('Parse children: simple', () => {
  const reader = new Reader(
    'x',
    '<span>hola</span>adios<ul><li>item</li></ul></div>'
  );
  const tag = parseChildren(reader, 'div') as ElemSchema[];
  const result: ElemSchema[] = [
    {
      type: NodeTypes.TAG,
      name: 'span',
      isVoid: false,
      attributes: [],
      events: [],
      isDirective: false,
      children: [
        {
          type: NodeTypes.TEXT,
          value: 'hola',
          dynamic: false,
          reactive: false,
          start: 6,
          end: 9,
        },
      ],
      start: 0,
      end: 16,
    },
    {
      type: NodeTypes.TEXT,
      value: 'adios',
      dynamic: false,
      reactive: false,
      start: 17,
      end: 21,
    },
    {
      type: NodeTypes.TAG,
      name: 'ul',
      isVoid: false,
      attributes: [],
      events: [],
      isDirective: false,
      children: [
        {
          type: NodeTypes.TAG,
          name: 'li',
          isVoid: false,
          attributes: [],
          events: [],
          isDirective: false,
          children: [
            {
              type: NodeTypes.TEXT,
              value: 'item',
              dynamic: false,
              reactive: false,
              start: 30,
              end: 33,
            },
          ],
          start: 26,
          end: 38,
        },
      ],
      start: 22,
      end: 43,
    },
  ];
  expect(tag).toEqual(result);
});

test('Parse children: with simple loop tag', () => {
  const reader = new Reader(
    'x',
    '<loop (lista) (index)="i" (pos)="p">hola</loop></div>'
  );
  const tag = parseChildren(reader, 'div') as ElemSchema[];
  const result: ElemSchema[] = [
    {
      type: NodeTypes.LOOP,
      target: [
        {
          scope: 0,
          value: 'lista',
        },
      ],
      index: 'i',
      pos: 'p',
      children: [
        {
          type: NodeTypes.TEXT,
          value: 'hola',
          dynamic: false,
          reactive: false,
          start: 36,
          end: 39,
        },
      ],
      start: 0,
      end: 46,
    },
  ];
  expect(tag).toEqual(result);
});

test('Parse children: with simple conditional tag', () => {
  const reader = new Reader('x', '<if (isUser)>hola</if></div>');
  const tag = parseChildren(reader, 'div') as ElemSchema[];
  const result: ElemSchema[] = [
    {
      type: NodeTypes.TREE,
      kind: 'if',
      reactive: false,
      requirement: [
        {
          scope: 0,
          value: 'isUser',
        },
      ],
      yes: [
        {
          type: NodeTypes.TEXT,
          value: 'hola',
          dynamic: false,
          reactive: false,
          start: 13,
          end: 16,
        },
      ],
      no: [],
      start: 0,
      end: 21,
    },
  ];
  expect(tag).toEqual(result);
});

test('Parse children: with simple loop directive', () => {
  const reader = new Reader('x', '<span (loop)="list">item</span></div>');
  const tag = parseChildren(reader, 'div') as ElemSchema[];
  const result: ElemSchema[] = [
    {
      type: NodeTypes.LOOP,
      target: [
        {
          scope: 0,
          value: 'list',
        },
      ],
      index: undefined,
      pos: undefined,
      children: [
        {
          type: NodeTypes.TAG,
          name: 'span',
          isVoid: false,
          attributes: [],
          events: [],
          isDirective: false,
          children: [
            {
              type: NodeTypes.TEXT,
              value: 'item',
              dynamic: false,
              reactive: false,
              start: 20,
              end: 23,
            },
          ],
          start: 0,
          end: 30,
        },
      ],
      start: 6,
      end: 18,
      source: {
        type: NodeTypes.ATTRIBUTE,
        name: 'loop',
        value: 'list',
        isBoolean: false,
        isEvent: false,
        dynamic: false,
        reactive: false,
        expr: [
          {
            scope: 0,
            value: 'list',
          },
        ],
        isDirective: true,
        start: 6,
        end: 18,
      },
    },
  ];
  expect(tag).toEqual(result);
});

test('Parse children: with simple conditional directive', () => {
  const reader = new Reader('x', '<span (if)="saludo">hola</span></div>');
  const tag = parseChildren(reader, 'div') as ElemSchema[];
  const result: ElemSchema[] = [
    {
      type: NodeTypes.TREE,
      kind: 'if',
      requirement: [
        {
          scope: 0,
          value: 'saludo',
        },
      ],
      yes: [
        {
          type: NodeTypes.TAG,
          name: 'span',
          isVoid: false,
          attributes: [],
          events: [],
          isDirective: false,
          children: [
            {
              type: NodeTypes.TEXT,
              value: 'hola',
              dynamic: false,
              reactive: false,
              start: 20,
              end: 23,
            },
          ],
          start: 0,
          end: 30,
        },
      ],
      no: [],
      reactive: false,
      start: 6,
      end: 18,
    },
  ];
  expect(tag).toEqual(result);
});

test('Parse children: with mix of attribute directives', () => {
  const reader = new Reader(
    'x',
    '<span (loop)="lista" (if)="isUser" (pos)="p" (index)="i" id="myid">hola</span></div>'
  );
  const tag = parseChildren(reader, 'div') as ElemSchema[];
  const result: LoopSchema = {
    type: NodeTypes.LOOP,
    target: [{ scope: 0, value: 'lista' }],
    index: 'i',
    pos: 'p',
    source: {
      type: NodeTypes.ATTRIBUTE,
      name: 'loop',
      value: 'lista',
      isEvent: false,
      isDirective: true,
      isBoolean: false,
      reactive: false,
      dynamic: false,
      expr: [{ scope: 0, value: 'lista' }],
      start: 6,
      end: 19,
    },
    children: [
      {
        type: NodeTypes.TREE,
        kind: 'if',
        requirement: [
          {
            scope: 0,
            value: 'isUser',
          },
        ],
        yes: [
          {
            type: NodeTypes.TAG,
            name: 'span',
            isVoid: false,
            attributes: [
              {
                type: NodeTypes.ATTRIBUTE,
                name: 'id',
                value: 'myid',
                isEvent: false,
                isDirective: false,
                isBoolean: false,
                expr: [],
                reactive: false,
                dynamic: false,
                start: 57,
                end: 65,
              },
            ],
            events: [],
            isDirective: false,
            children: [
              {
                type: NodeTypes.TEXT,
                value: 'hola',
                dynamic: false,
                reactive: false,
                start: 67,
                end: 70,
              },
            ],
            start: 0,
            end: 77,
          },
        ],
        no: [],
        reactive: false,
        start: 21,
        end: 33,
      },
    ],
    start: 6,
    end: 19,
  };
  expect(tag).toEqual([result]);
});
