/**
 * Created by dongyancen on 14-4-1.
 */
describe("examples", function () {
//toBe   相当于===，处理简单字面值和变量
    it("toBe相当于===", function () {
        var a = 12;
        var b = a;
        expect(a).toBe(b);
    });
});