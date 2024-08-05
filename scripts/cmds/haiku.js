module.exports = {
config: {
name: "haiku",
category: "ai"
}, 
onStart: async function ({ message: { reply }, args }) {
reply((await require("axios").get("https://samirxpikachu.onrender.com/haiku?prompt=" + args.join(' ') || "hello" )).data)
}
};