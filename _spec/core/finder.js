/**
 * Created by dongyancen on 14-3-5.
 */
describe("getCurrentPath", function () {
//toBe   相当于===，处理简单字面值和变量
    it("getCurrentPath", function () {
        if(ua.browser.chrome){
            var f = new UF.Finder();
            expect(f.getCurrentPath()).toBe('/');
        }

    });
});