import { tagnames } from '../common';
import { directiveTags } from '../types';

const allTags = tagnames.concat(directiveTags);
const regexStr = '^<(' + allTags.concat().join('|') + ')(\\s|>)';
const allTagsExp = new RegExp(regexStr);

export class Reader {
  sourceFile: string;
  source: string;
  private index: number;
  constructor(sourceFile: string, source: string, index = 0) {
    this.sourceFile = sourceFile;
    this.source = source;
    this.index = index;
  }
  getIndex(): number {
    return this.index;
  }
  char(): string {
    return this.source[this.index];
  }
  slice(start = 0, end?: number): string {
    return end
      ? this.source.slice(this.index + start, this.index + end)
      : this.source.slice(this.index + start);
  }
  next(amount = 1): string {
    this.index += amount;
    return this.source[this.index];
  }
  toNext(r: RegExp): string {
    const rest = this.slice();
    const m = rest.match(r);
    if (!m || !('0' in m)) throw new Error('string not found');
    const result = this.slice(0, m.index);
    this.advance(m.index as number);
    return result;
  }
  notFinished(): boolean {
    return this.index < this.source.length - 2;
  }
  isCommentTag(): boolean {
    return this.slice(0, 4) === '<!--';
  }
  isScriptTag(): boolean {
    const str = this.slice(0, 12);
    return !!str.match(/^<script(\s|>)/);
  }
  isTemplate(): boolean {
    const str = this.slice(0, 12);
    return !!str.match(/^<template(\s|>)/);
  }
  isCustomComp(): boolean {
    const rest = this.slice();
    return !rest.match(allTagsExp);
  }
  isLoop(): boolean {
    const str = this.slice(0, 12);
    return !!str.match(/^<loop(\s|>)/);
  }
  isTree(): boolean {
    const str = this.slice(0, 12);
    return !!str.match(/^<(if|elseif|else)(\s|>)/);
  }
  isTagClosing(tagname = ''): boolean {
    const str = this.slice(0, 2 + tagname.length);
    return str === '</' + tagname;
  }
  tagHasMoreAttributes(): boolean {
    const rest = this.slice();
    return !rest.match(/^\s*\/?>/);
  }
  advance(amount: number | string) {
    const realAmount = typeof amount === 'number' ? amount : amount.length;
    this.index += realAmount;
  }
  isX(chars: string) {
    return this.slice(0, chars.length) === chars;
  }
}
