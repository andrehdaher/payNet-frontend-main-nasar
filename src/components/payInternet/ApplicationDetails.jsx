import { useNavigate } from 'react-router-dom';
import SOULHILLCRYSTAL from '../../assets/SOULHILLCRYSTAL.jpeg'
import LIKEELIVE from '../../assets/LIKEELIVE.jpeg'
import YOHO from '../../assets/YOHO.jpeg'
import AHLANCHAT from '../../assets/AHLANCHAT.jpeg'
import SOULSTAR from '../../assets/SOULSTAR.jpeg'
import HONEYJAR from '../../assets/HONEYJAR.jpeg'
import BIGOLIVE from '../../assets/BIGOLIVE.jpeg'
import PARTYSTAR from '../../assets/PARTYSTAR.jpeg'
import FUNCHAT from '../../assets/4FUNCHAT.jpeg'
import LIGHTCHAT from '../../assets/LIGHTCHAT.jpeg'
import YOYO from '../../assets/YOYO.jpeg'
import ZAAR from '../../assets/ZAAR.jpeg'
import COCCO from '../../assets/COCCO.jpeg'
import POPPOLLIVE from '../../assets/POPPOLLIVE.jpeg'
import LAMA from '../../assets/LAMA.jpeg'
import WAHO from '../../assets/WAHO.jpeg'
import MEYO from '../../assets/MEYO.jpeg'
import KIYOLIVE from '../../assets/KIYOLIVE.jpeg'
import LAMICHAT from '../../assets/LAMICHAT.jpeg'
import YOOY from '../../assets/YOOY.jpeg'
import XENALIVE from '../../assets/XENALIVE.jpeg'
import AYOME from '../../assets/AYOME.jpeg'
import LIGOLIVE from '../../assets/LIGOLIVE.jpeg'
import HAKICHAT from '../../assets/HAKICHAT.jpeg'
import FANCYLIVE from '../../assets/FANCYLIVE.jpeg'
import OOHLA from '../../assets/OOHLA.jpeg'
import CHAMET from '../../assets/CHAMET.jpeg'
import MICOCHAT from '../../assets/MICOCHAT.jpeg'
import IMO from '../../assets/IMO.jpeg'
import AMAR from '../../assets/AMAR.jpeg'
import WEGO from '../../assets/WEGO.jpeg'
import BINMOCHAT from '../../assets/BINMOCHAT.jpeg'
import LITCHAT from '../../assets/LITCHAT.jpeg'
import TAMICHAT from '../../assets/TAMICHAT.jpeg'
import TOPTOP from '../../assets/TOPTOP.jpeg'
import MANGOLIVE from '../../assets/MANGOLIVE.jpeg'
import SOYOCHAT from '../../assets/SOYOCHAT.jpeg'
import MR7BA from '../../assets/MR7BA.jpeg'
import SALAMCHAT from '../../assets/SALAMCHAT.jpeg'
import DITTOLIVE from '../../assets/DITTOLIVE.jpeg'
import NABDCHAT from '../../assets/NABDCHAT.jpeg'
import GIMMELIVE from '../../assets/GIMMELIVE.jpeg'
import WYAKCHAT from '../../assets/WYAKCHAT.jpeg'
import TAKALIVE from '../../assets/TAKALIVE.jpeg'
import MIGOLIVE from '../../assets/MIGOLIVE.jpeg'
import UPLIVE from '../../assets/UPLIVE.jpeg'
import YOBICHAT from '../../assets/YOBICHAT.jpeg'
import LIVU from '../../assets/LIVU.jpeg'
import SABACHAT from '../../assets/SABACHAT.jpeg'
import OLAMET from '../../assets/OLAMET.jpeg'
import SUGO from '../../assets/SUGO.jpeg'
import HAWACHAT from '../../assets/HAWACHAT.jpeg'
import YALLALIVE from '../../assets/YALLALIVE.jpeg'
import ROOKA from '../../assets/ROOKA.jpeg'
import SKYCHAT from '../../assets/SKYCHAT.jpeg'
import SUPERLIVE from '../../assets/SUPERLIVE.jpeg'
import ROOHCHAT from '../../assets/ROOHCHAT.jpeg'
import DIMOCHAT from '../../assets/DIMOCHAT.jpeg'
import LIONSCHAT from '../../assets/LIONSCHAT.jpeg'
import HIPARTY from '../../assets/HIPARTY.jpeg'
import BELLA from '../../assets/BELLA.jpeg'
import HAMIPARTY from '../../assets/HAMIPARTY.jpeg'
import WESTAR from '../../assets/WESTAR.jpeg'
import HABICHAT from '../../assets/HABICHAT.jpeg'
import SOMATCH from '../../assets/SOMATCH.jpeg'
import LAYLACHAT from '../../assets/LAYLACHAT.jpeg'
import PARTYHERO from '../../assets/PARTYHERO.jpeg'
import FOFOCHAT from '../../assets/FOFOCHAT.jpeg'
import HALAME from '../../assets/HALAME.jpeg'
import DANACHAT from '../../assets/DANACHAT.jpeg'
import KITI from '../../assets/KITI.jpeg'
import SAYALIKEE from '../../assets/SAYALIKEE.jpeg'
import MASHICHAT from '../../assets/MASHICHAT.jpeg'
import AZALLIVE from '../../assets/AZALLIVE.jpeg'

export default function ApplicationDetails() {
    const navigate = useNavigate();
    const Action = (formType) => {
        navigate('/payinternet', { state: formType });
    };


    const ApplicationDetails = [
        {
            title: ' SOULHILL CRYSTAL',
            formType: 'SOULHILLCRYSTAL',
            description: 'شحن موقع SOULHILL CRYSTAL بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: SOULHILLCRYSTAL
        },
        {
            title: 'شحن LIKEE LIVE',
            formType: 'LIKEELIVE',
            description: 'شحن موقع LIKEE LIVE بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: LIKEELIVE,
        },
        {
            title: 'شحن YOHO',
            formType: 'YOHO',
            description: 'شحن موقع YOHO بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: YOHO,
        },
        {
            title: 'شحن AHLAN CHAT',
            formType: 'AHLANCHAT',
            description: 'شحن موقع AHLAN CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: AHLANCHAT,
        },
        {
            title: 'شحن SOUL STAR',
            formType: 'SOULSTAR',
            description: 'شحن موقع SOUL STAR بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: SOULSTAR,
        },
        {
            title: 'شحن HONEY JAR',
            formType: 'HONEYJAR',
            description: 'شحن موقع HONEY JAR بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: HONEYJAR,
        },
        {
            title: 'شحن BIGO LIVE',
            formType: 'BIGOLIVE',
            description: 'شحن موقع BIGO LIVE بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: BIGOLIVE,
        },
        {
            title: 'شحن PARTY STAR',
            formType: 'PARTYSTAR',
            description: 'شحن موقع PARTY STAR بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: PARTYSTAR,
        },
        {
            title: 'شحن 4FUN CHAT',
            formType: '4FUNCHAT',
            description: 'شحن موقع 4FUN CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: FUNCHAT,
        },
        {
            title: 'شحن LIGHT CHAT',
            formType: 'LIGHTCHAT',
            description: 'شحن موقع LIGHT CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: LIGHTCHAT,
        },
        {
            title: 'شحن YOYO',
            formType: 'YOYO',
            description: 'شحن موقع YOYO بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: YOYO,
        },
        {
            title: 'شحن ZAAR',
            formType: 'ZAAR',
            description: 'شحن موقع ZAAR بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: ZAAR,
        },
        {
            title: 'شحن COCCO',
            formType: 'COCCO',
            description: 'شحن موقع COCCO بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: COCCO,
        },
        {
            title: 'شحن POPPO LIVE',
            formType: 'POPPOLLIVE',
            description: 'شحن موقع POPPO LIVE بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: POPPOLLIVE
        },
        {
            title: 'شحن LAMA',
            formType: 'LAMA',
            description: 'شحن موقع LAMA بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: LAMA,
        },
        {
            title: 'شحن WAHO',
            formType: 'WAHO',
            description: 'شحن موقع WAHO بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: WAHO,
        },
        {
            title: 'شحن MEYO',
            formType: 'MEYO',
            description: 'شحن موقع MEYO بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: MEYO,
        },
        {
            title: 'شحن KIYO LIVE',
            formType: 'KIYOLIVE',
            description: 'شحن موقع KIYO LIVE بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: KIYOLIVE,
        },
        {
            title: 'شحن LAMI CHAT',
            formType: 'LAMICHAT',
            description: 'شحن موقع LAMI CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: LAMICHAT,
        },
        {
            title: 'شحن YOOY',
            formType: 'YOOY',
            description: 'شحن موقع YOOY بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: YOOY,
        },
        {
            title: 'شحن XENA LIVE',
            formType: 'XENALIVE',
            description: 'شحن موقع XENA LIVE بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: XENALIVE,
        },
        {
            title: 'شحن AYOME',
            formType: 'AYOME',
            description: 'شحن موقع AYOME بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: AYOME,
        },
        {
            title: 'شحن LIGO LIVE',
            formType: 'LIGOLIVE',
            description: 'شحن موقع LIGO LIVE بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: LIGOLIVE,
        },
        {
            title: 'شحن HAKI CHAT',
            formType: 'HAKICHAT',
            description: 'شحن موقع HAKI CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: HAKICHAT,
        },
        {
            title: 'شحن FANCY LIVE',
            formType: 'FANCYLIVE',
            description: 'شحن موقع FANCY LIVE بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: FANCYLIVE,
        },
        {
            title: 'شحن OOHLA',
            formType: 'OOHLA',
            description: 'شحن موقع OOHLA بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: OOHLA,
        },
        {
            title: 'شحن CHAMET',
            formType: 'CHAMET',
            description: 'شحن موقع CHAMET بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: CHAMET,
        },
        {
            title: 'شحن MICO CHAT',
            formType: 'MICOCHAT',
            description: 'شحن موقع MICO CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: MICOCHAT,
        },
        {
            title: 'شحن IMO',
            formType: 'IMO',
            description: 'شحن موقع IMO بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: IMO,
        },
        {
            title: 'شحن AMAR',
            formType: 'AMAR',
            description: 'شحن موقع AMAR بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: AMAR,
        },
        {
            title: 'شحن WEGO',
            formType: 'WEGO',
            description: 'شحن موقع WEGO بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: WEGO,
        },
        {
            title: 'شحن BINMO CHAT',
            formType: 'BINMOCHAT',
            description: 'شحن موقع BINMO CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: BINMOCHAT,
        },
        {
            title: 'شحن LiT CHAT',
            formType: 'LITCHAT',
            description: 'شحن موقع LiT CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: LITCHAT,
        },
        {
            title: 'شحن TAMI CHAT',
            formType: 'TAMICHAT',
            description: 'شحن موقع TAMI CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: TAMICHAT,
        },
        {
            title: 'شحن TOP TOP',
            formType: 'TOPTOP',
            description: 'شحن موقع TOP TOP بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: TOPTOP,
        },
        {
            title: 'شحن MANGO LIVE',
            formType: 'MANGOLIVE',
            description: 'شحن موقع MANGO LIVE بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: MANGOLIVE,
        },
        {
            title: 'شحن SOYO CHAT',
            formType: 'SOYOCHAT',
            description: 'شحن موقع SOYO CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: SOYOCHAT,
        },
        {
            title: 'شحن MR7BA',
            formType: 'MR7BA',
            description: 'شحن موقع MR7BA بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: MR7BA,
        },
        {
            title: 'شحن SALAM CHAT',
            formType: 'SALAMCHAT',
            description: 'شحن موقع SALAM CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: SALAMCHAT,
        },
        {
            title: 'شحن DITTO LIVE',
            formType: 'DITTOLIVE',
            description: 'شحن موقع DITTO LIVE بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: DITTOLIVE,
        },
        {
            title: 'شحن NABD CHAT',
            formType: 'NABDCHAT',
            description: 'شحن موقع NABD CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: NABDCHAT,
        },
        {
            title: 'شحن GIMME LIVE',
            formType: 'GIMMELIVE',
            description: 'شحن موقع GIMME LIVE بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: GIMMELIVE,
        },
        {
            title: 'شحن WYAK CHAT',
            formType: 'WYAKCHAT',
            description: 'شحن موقع WYAK CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: WYAKCHAT,
        },
        {
            title: 'شحن TAKA LIVE',
            formType: 'TAKALIVE',
            description: 'شحن موقع TAKA LIVE بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: TAKALIVE,
        },
        {
            title: 'شحن MIGO LIVE',
            formType: 'MIGOLIVE',
            description: 'شحن موقع MIGO LIVE بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: MIGOLIVE,
        },
        {
            title: 'شحن UP LIVE',
            formType: 'UPLIVE',
            description: 'شحن موقع UP LIVE بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: UPLIVE,
        },
        {
            title: 'شحن YOBI CHAT',
            formType: 'YOBICHAT',
            description: 'شحن موقع YOBI CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: YOBICHAT,
        },
        {
            title: 'شحن LIVU',
            formType: 'LIVU',
            description: 'شحن موقع LIVU بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: LIVU,
        },
        {
            title: 'شحن SABA CHAT',
            formType: 'SABACHAT',
            description: 'شحن موقع SABA CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: SABACHAT,
        },
        {
            title: 'شحن OLAMET',
            formType: 'OLAMET',
            description: 'شحن موقع OLAMET بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: OLAMET,
        },
        {
            title: 'شحن SUGO',
            formType: 'SUGO',
            description: 'شحن موقع SUGO بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: SUGO,
        },
        {
            title: 'شحن HAWA CHAT',
            formType: 'HAWACHAT',
            description: 'شحن موقع HAWA CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: HAWACHAT,
        },
        {
            title: 'شحن YALLA LIVE',
            formType: 'YALLALIVE',
            description: 'شحن موقع YALLA LIVE بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: YALLALIVE,
        },
        {
            title: 'شحن ROOKA',
            formType: 'ROOKA',
            description: 'شحن موقع ROOKA بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: ROOKA,
        },
        {
            title: 'شحن SKY CHAT',
            formType: 'SKYCHAT',
            description: 'شحن موقع SKY CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: SKYCHAT,
        },
        {
            title: 'شحن SUPER LIVE',
            formType: 'SUPERLIVE',
            description: 'شحن موقع SUPER LIVE بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: SUPERLIVE,

        },
        {
            title: 'شحن ROOH CHAT',
            formType: 'ROOHCHAT',
            description: 'شحن موقع ROOH CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: ROOHCHAT,
        },
        {
            title: 'شحن DIMO CHAT',
            formType: 'DIMOCHAT',
            description: 'شحن موقع DIMO CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: DIMOCHAT,
        },
        {
            title: 'شحن LIONS CHAT',
            formType: 'LIONSCHAT',
            description: 'شحن موقع LIONS CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: LIONSCHAT,
        },
        {
            title: 'شحن HIPARTY',
            formType: 'HIPARTY',
            description: 'شحن موقع HIPARTY بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: HIPARTY,
        },
        {
            title: 'شحن BELLA',
            formType: 'BELLA',
            description: 'شحن موقع BELLA بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: BELLA,
        },
        {
            title: 'شحن HAMI PARTY',
            formType: 'HAMIPARTY',
            description: 'شحن موقع HAMI PARTY بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: HAMIPARTY,
        },
        {
            title: 'شحن WESTAR',
            formType: 'WESTAR',
            description: 'شحن موقع WESTAR بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: WESTAR,
        },
        {
            title: 'شحن HABI CHAT',
            formType: 'HABICHAT',
            description: 'شحن موقع HABI CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: HABICHAT,
        },
        {
            title: 'شحن SOMATCH',
            formType: 'SOMATCH',
            description: 'شحن موقع SOMATCH بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: SOMATCH,
        },
        {
            title: 'شحن LAYLA CHAT',
            formType: 'LAYLACHAT',
            description: 'شحن موقع LAYLA CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: LAYLACHAT,
        },
        {
            title: 'شحن PARTY HERO',
            formType: 'PARTYHERO',
            description: 'شحن موقع PARTY HERO بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: PARTYHERO,
        },
        {
            title: 'شحن FOFO CHAT',
            formType: 'FOFOCHAT',
            description: 'شحن موقع FOFO CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: FOFOCHAT,
        },
        {
            title: 'شحن HALA ME',
            formType: 'HALAME',
            description: 'شحن موقع HALA ME بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: HALAME,
        },
        {
            title: 'شحن DANA CHAT',
            formType: 'DANACHAT',
            description: 'شحن موقع DANA CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: DANACHAT,
        },
        {
            title: 'شحن KITI',
            formType: 'KITI',
            description: 'شحن موقع KITI بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: KITI,
        },
        {
            title: 'شحن SAYA LIKEE',
            formType: 'SAYALIKEE',
            description: 'شحن موقع SAYA LIKEE بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: SAYALIKEE,
        },
        {
            title: 'شحن MASHI CHAT',
            formType: 'MASHICHAT',
            description: 'شحن موقع MASHI CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: MASHICHAT,
        },
        {
            title: 'شحن AZAL LIVE',
            formType: 'AZALLIVE',
            description: 'شحن موقع AZAL LIVE بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: AZALLIVE,
        },
        {
            title: 'شحن IMU CHAT',
            formType: 'IMUCHAT',
            description: 'شحن موقع IMU CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن HIPLAY CHAT',
            formType: 'HIPLAYCHAT',
            description: 'شحن موقع HIPLAY CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن MOLI STAR',
            formType: 'MOLISTAR',
            description: 'شحن موقع MOLI STAR بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن YOLO',
            formType: 'YOLO',
            description: 'شحن موقع YOLO بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن 7STAR',
            formType: '7STAR',
            description: 'شحن موقع 7STAR بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن MAZYOUN',
            formType: 'MAZYOUN',
            description: 'شحن موقع MAZYOUN بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن SAADA CHAT',
            formType: 'SAADACHAT',
            description: 'شحن موقع SAADA CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن NAWA LIVE',
            formType: 'NAWALIVE',
            description: 'شحن موقع NAWA LIVE بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن YAMI STAR',
            formType: 'YAMISTAR',
            description: 'شحن موقع YAMI STAR بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن WESO CHAT',
            formType: 'WESOCHAT',
            description: 'شحن موقع WESO CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن ASHA',
            formType: 'ASHA',
            description: 'شحن موقع ASHA بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن YAAHLAN CHAT',
            formType: 'YAAHLANCHAT',
            description: 'شحن موقع YAAHLAN CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن YAHLLA',
            formType: 'YAHLLA',
            description: 'شحن موقع YAHLLA بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن TALK TALK',
            formType: 'TALKTALK',
            description: 'شحن موقع TALK TALK بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن HIYA CHAT',
            formType: 'HIYACHAT',
            description: 'شحن موقع HIYA CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن MAJLIS CHAT',
            formType: 'MAJLISCHAT',
            description: 'شحن موقع MAJLIS CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن ZNET',
            formType: 'ZNET',
            description: 'شحن موقع ZNET بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن BOBO',
            formType: 'BOBO',
            description: 'شحن موقع BOBO بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن HIGO LIVE',
            formType: 'HIGOLIVE',
            description: 'شحن موقع HIGO LIVE بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن TADA CHAT',
            formType: 'TADACHAT',
            description: 'شحن موقع TADA CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن OPA LIVE',
            formType: 'OPALIVE',
            description: 'شحن موقع OPA LIVE بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن AMO',
            formType: 'AMO',
            description: 'شحن موقع AMO بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن KWAI',
            formType: 'KWAI',
            description: 'شحن موقع KWAI بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن VECO CHAT',
            formType: 'VECOCHAT',
            description: 'شحن موقع VECO CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن HABBEY CHAT',
            formType: 'HABBEYCHAT',
            description: 'شحن موقع HABBEY CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن TANGO',
            formType: 'TANGO',
            description: 'شحن موقع TANGO بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن HIYOO CHAT',
            formType: 'HIYOOCHAT',
            description: 'شحن موقع HIYOO CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن SOUL CHAT',
            formType: 'SOULCHAT',
            description: 'شحن موقع SOUL CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن HOBY CHAT',
            formType: 'HOBYCHAT',
            description: 'شحن موقع HOBY CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن GALA STAR',
            formType: 'GALASTAR',
            description: 'شحن موقع GALA STAR بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن JUNKO CHAT',
            formType: 'JUNKOCHAT',
            description: 'شحن موقع JUNKO CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن E PARTY',
            formType: 'EPARTY',
            description: 'شحن موقع E PARTY بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن KAFU',
            formType: 'KAFU',
            description: 'شحن موقع KAFU بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن SAHRA CHAT',
            formType: 'SAHRACHAT',
            description: 'شحن موقع SAHRA CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن FALLA',
            formType: 'FALLA',
            description: 'شحن موقع FALLA بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن KESSMET CHAT',
            formType: 'KESSMETCHAT',
            description: 'شحن موقع KESSMET CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن HART LIVE',
            formType: 'HARTLIVE',
            description: 'شحن موقع HART LIVE بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن NADDY STAR',
            formType: 'NADDYSTAR',
            description: 'شحن موقع NADDY STAR بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن WAKI STAR',
            formType: 'WAKISTAR',
            description: 'شحن موقع WAKI STAR بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن LAKI CHAT',
            formType: 'LAKICHAT',
            description: 'شحن موقع LAKI CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن UP FUN',
            formType: 'UPFUN',
            description: 'شحن موقع UP FUN بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن TIK TOK',
            formType: 'TIKTOK',
            description: 'شحن موقع TIK TOK بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن SIYA CHAT',
            formType: 'SIYACHAT',
            description: 'شحن موقع SIYA CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن POTA LIVE',
            formType: 'POTALIVE',
            description: 'شحن موقع POTA LIVE بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن YOPARTI',
            formType: 'YOPARTI',
            description: 'شحن موقع YOPARTI بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن SODFA CHAT',
            formType: 'SODFACHAT',
            description: 'شحن موقع SODFA CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن HALO STAR',
            formType: 'HALOSTAR',
            description: 'شحن موقع HALO STAR بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن BOLI',
            formType: 'BOLI',
            description: 'شحن موقع BOLI بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن VOVA',
            formType: 'VOVA',
            description: 'شحن موقع VOVA بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن JOYO',
            formType: 'JOYO',
            description: 'شحن موقع JOYO بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن WAAW CHAT',
            formType: 'WAAWCHAT',
            description: 'شحن موقع WAAW CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن SAMA CHAT',
            formType: 'SAMACHAT',
            description: 'شحن موقع SAMA CHAT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن YOKI',
            formType: 'YOKI',
            description: 'شحن موقع YOKI بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
        {
            title: 'شحن FUN UP',
            formType: 'FUNUP',
            description: 'شحن موقع FUN UP بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
        },
    ];

    return ApplicationDetails; // إرجاع الـ array

}