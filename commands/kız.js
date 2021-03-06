/*
Bu proje exsus ve nymphdora sunucuları için özel olarak Sensei tarafından hazırlanmıştır!
Bu proje MIT lisansı ile korunuyor ve izinsiz paylaşılması yasaktır!
Bu proje kodun daha açıklayıcı olması için bir çok yorum eklenerek yazılmıştır!
*/

const { Discord, MessageEmbed } = require('discord.js')
module.exports = {
name:'kız',
aliases:['k', 'girl', 'female'],
cooldown:2,
async execute(client, message, args, options){

/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Kodun hangi koşullarda çalışmayacağı kısımların belirlendiği kısım...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

if(!message.member.roles.cache.has(options.kayıt_yetkilisi_rol_id) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('Bu komutu kullanabilmek için kayıt yetkilisi rolüne veya admin yetkilerine ihtiyacın var!') 
if(message.channel.id != options.kayıt_kanalı_id) return message.channel.send('Bu komutu bu kanalda kullanamazsınız!')

//Kod boyunca bir çok kez kullancağımız etiket/id kısmını hallediyoruz (karışık gelebilir o yüzden ellemeyin)...

var etiket = message.mentions.users.first()
if(!etiket) {
etiket = message.guild.members.cache.get(args[0])
if(!args[0]) return message.channel.send(`**Örnek kullanım:** ${client.prefix}erkek <id/etiket> <isim> <yaş>`)
if(!etiket) return message.channel.send("Bu sunucuda bu id ye sahip bir kişi bulunamadı.")
if(etiket) etiket = message.guild.members.cache.get(args[0]).user}

//User (discord kullanıcısı) olarak tanımladığımız 'etiket' burada member (sunucu üyesi) olarak lazım oluyor ona göre düzenlemelerimizi yapıyoruz...

let member = message.guild.members.cache.get(etiket.id)
if(member.id == message.author.id) return message.channel.send('Kendinizi kaydedemezsiniz.')
if(etiket.bot) return message.channel.send('Bir botu kayıt edemezsiniz.')
if(member.roles.cache.has(options.erkek_rolü_id)) return message.channel.send('Bu kullanıcı zaten kayıtlı!')
if(member.roles.cache.has(options.kız_rolü_id)) return message.channel.send('Bu kullanıcı zaten kayıtlı!')

/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sonradan kullanmak üzere verilerimizi tanımlıyoruz...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

//Bu kısımda kız.<veri> kullanarak çekeceğimiz veriler (dağınıklık olmasın diye bu şekilde yaptım) ve kayıtdan sonra atılacak mesajın gideceği kanalı belirliyoruz...

const kayıtdan_sonra_kanalı = client.channels.cache.get(options.kayıt_edilince_gönderilen_mesaj_kanal_id)
const kız = 
{
kişi: message.guild.members.cache.get(etiket.id),
rolü: message.guild.roles.cache.get(options.kız_rolü_id),
kayıtsız: message.guild.roles.cache.get(options.kayıtsız_rolü_id),
isim: args[1],
yaş: args[2],
}

//Kayıt başarılı olursa kullanıcının değiştirilecek ismini belirliyoruz (oluşan ismin hangi koşullarda yapılamayacağı da belirleniyor)...

const yeni_isim = (`${options.sunucu_tag} ${kız.isim ? kız.isim : etiket.username}${kız.yaş ? ` | ${kız.yaş}` : ""}`) 
if(yeni_isim.length > 32) return message.channel.send('2-32 karakter isim kısıtlamasını aşmayın.')
if(args[2]) { if(isNaN(kız.yaş)) return message.channel.send('Yaş bilgisi sayı olmak zorundadır.') }
if(kız.yaş > 100) return message.channel.send('Yaş 0-100 arası olmak zorundadır.')

/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Embedler dosyasında bir kısmını tanımladığımız embedleri düzenliyoruz (bu embedler çeşitli durumlarda gönderilmek üzere hazırlandı)...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

//Kayıt hatasız bir şekilde biterse gönderilecek embed...

başarılı.setDescription(`Bütün işlemler başarılı bir şekilde gerçekleştirildi!\nKullanıcı ${message.author} tarafından \`${yeni_isim}\` adı ile kaydedilmiştir.\nKullanıcıya ${kız.rolü} rolü verildi ve ${kız.kayıtsız} rolü alındı.`)

//Kayıt hatalı bir şekilde sonuçlanırsa gönderilecek embed...

başarısız.setDescription(`Bu komut uygulanırken bir hata oluştu lütfen komutu düzgün kullandığınızdan emin olunuz!\n\`\`\`\n${client.prefix} erkek <etiket/id> <isim> <yaş>\n\`\`\``)

//Kayıtdan sonra gönderilecek embed (genelde sohbet yada hoşgeldin kanalı ayarlanır)...

let sayım = message.guild.memberCount - message.guild.roles.cache.get(options.kayıtsız_rolü_id).members.size
kayıtdan_sonra_embed.setTitle(`Hoşgeldin ${kız.isim || kız.yaş ? kız.isim : yeni_isim}`)
kayıtdan_sonra_embed.setThumbnail(etiket.displayAvatarURL({dynamic:true, size: 1024}))

//Eğer options dosyasında zorunlu olmayan 2 yeri doldurduysanız bura etkilenir (iyi bir şekilde)...

kayıtdan_sonra_embed.setDescription(`Sunucumuza hoşgeldin seninle birlikte **${sayım}** kişiyiz!${options.kurallar_kanalı_id ? `\nBuradan kuralları okumalısın <#${options.kurallar_kanalı_id}>` : ""} ${options.rol_alım_kanalı_id ? `\nBuradan da rollerini alabilirsin <#${options.rol_alım_kanalı_id}>` : ""}\nİyi eğlenceler ❤ `)

/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Kayıdın başarılı olması için hatasız bir şekilde sonuçlanması gereken durumlar...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

try{
await kız.kişi.setNickname(yeni_isim);
await kız.kişi.roles.remove(kız.kayıtsız);
await kız.kişi.roles.add(kız.rolü);
await message.channel.send(başarılı)
await kayıtdan_sonra_kanalı.send(kayıtdan_sonra_embed)
}

/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Eğer yukarıda ki 'try' kısmında bir hata olursa bu uygulanacak...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

catch(error) {
await console.log(error)
await message.channel.send(başarısız)
}
}}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
