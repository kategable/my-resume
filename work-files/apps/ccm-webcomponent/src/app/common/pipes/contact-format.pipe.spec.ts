import { ContactFormatPipe } from './contact-format.pipe';

describe('ContactformatPipe', () => {
  it('create an instance', () => {
    const pipe = new ContactFormatPipe();
    expect(pipe).toBeTruthy();
  });
  it('should return empty string', () => {
    const pipe = new ContactFormatPipe();
    expect(pipe.transform({ name: 'test' } as any, false)).toEqual('test');
  });
  it('should return name with email', () => {
    const pipe = new ContactFormatPipe();
    expect(pipe.transform({ name: 'dev', businessEmail: ['test'] } as any, true)).toEqual('dev <test>');
  });
  it('should return emai', () => {
    const pipe = new ContactFormatPipe();
    expect(pipe.transform({ businessEmail: ['test'] } as any, false)).toEqual('test');
  });
});
