import Pubg from '../../assets/pubg.jpeg'

import Freefire from '../../assets/freefire.jpeg'
import Pubgtr from '../../assets/pubgtr.jpeg'
import PlayImage from '../../assets/play.jpeg'

import Ballbool8 from '../../assets/ball-bool8.jpeg'
import Clashclans from '../../assets/clash-clans.jpeg'
import Clashroyall from '../../assets/clash-royall.jpeg'
import Jawaker from '../../assets/jawaker.jpeg'
import KnivesOut from '../../assets/knives-out.jpeg'
import Ludo from '../../assets/ludo.jpeg'
import MobileLegend from '../../assets/mobile-leg.jpeg'
import ProjectEntropy from '../../assets/ProjectEntropy.jpeg'
import without from '../../assets/without.jpeg'
import { useNavigate } from 'react-router-dom';
import {
    PROWAVE_DIRECT_TOPUP_GAMES,
    buildProWaveDirectTopUpRouteState,
} from '../../config/prowaveGames';

export default function PlayDetails() {
    const navigate = useNavigate();
    const proWaveImages = {
        PUBG: Pubg,
        FREE_FIRE: Freefire,
        DEFAULT: PlayImage,
    };
    const getDirectTopUpImage = (imageKey) => proWaveImages[imageKey] || proWaveImages.DEFAULT;
    const createDirectTopUpGameCard = (game) => ({
        title: game.title,
        formType: buildProWaveDirectTopUpRouteState(game),
        description: game.description,
        buttonText: "عرض التفاصيل",
        Action: (state) => navigate('/payapp', { state }),
        image: getDirectTopUpImage(game.imageKey),
        imageFit: "contain",
    });
    const directTopUpGames = PROWAVE_DIRECT_TOPUP_GAMES.map(createDirectTopUpGameCard);
    const additionalProWaveGames = [];
    const getProWaveImageForFormType = (_formType, fallback = PlayImage) => fallback;

    const playDetails = [
        {
            title: "شحن pubg mobile",
            formType: "PUBG",
            description: "شحن حسابات لعبة pubg mobile بسرعة وأمان.",
            buttonText: "عرض التفاصيل",
            Action: (formType) => { navigate('/payapp', { state: formType }) },
            image: getProWaveImageForFormType("PUBG", Pubg),
            imageFit: "contain",
        },
        {
            title: "شحن pubg turkey",
            formType: "PUBG TR",
            description: "شحن حسابات لعبة pubg turkey بسرعة وأمان.",
            buttonText: "عرض التفاصيل",
            Action: (formType) => { navigate('/payapp', { state: formType }) },
            image: Pubgtr
        },
        {
            title: "شحن free fire",
            formType: "FREE FIRE",
            description: "شحن حسابات لعبة فري فاير-free fire بسرعة وأمان.",
            buttonText: "عرض التفاصيل",
            Action: (formType) => { navigate('/payapp', { state: formType }) },
            image: getProWaveImageForFormType("FREE FIRE", Freefire),
            imageFit: "contain",
        },
        ...additionalProWaveGames,
        {
            title: "شحن ball pool 8",
            formType: "8 BALL POOL",
            description: "شحن حسابات لعبة ball pool 8 بسرعة وأمان.",
            buttonText: "عرض التفاصيل",
            Action: (formType) => { navigate('/payapp', { state: formType }) },
            image: Ballbool8
        },
        {
            title: "شحن clash of clans",
            formType: "CLASH OF CLANS",
            description: "شحن حسابات لعبة clash of clans بسرعة وأمان.",
            buttonText: "عرض التفاصيل",
            Action: (formType) => { navigate('/payapp', { state: formType }) },
            image: Clashclans
        },
        {
            title: "شحن clash royal",
            formType: "CLASH ROYAL",
            description: "شحن حسابات لعبة clash royal بسرعة وأمان.",
            buttonText: "عرض التفاصيل",
            Action: (formType) => { navigate('/payapp', { state: formType }) },
            image: Clashroyall
        },
        {
            title: "شحن جواكر بشكل يدوي",
            formType: "jawakerman",
            description: "شحن حسابات لعبة جواكر-jawaker بسرعة وأمان.",
            buttonText: "عرض التفاصيل",
            Action: (formType) => { navigate('/payinternet', { state: formType }) },
            image: Jawaker
        },
        {
            title: "شحن جواكر",
            formType: "JAWAKER",
            description: "شحن حسابات لعبة جواكر-jawaker بسرعة وأمان.",
            buttonText: "عرض التفاصيل",
            Action: (formType) => { navigate('/payapp', { state: formType }) },
            image: Jawaker
        },
        {
            title: "شحن knives out",
            formType: "KNIVES OUT",
            description: "شحن حسابات لعبة knives out بسرعة وأمان.",
            buttonText: "عرض التفاصيل",
            Action: (formType) => { navigate('/payapp', { state: formType }) },
            image: KnivesOut
        },
        {
            title: "شحن ludo king",
            formType: "LUDO KING",
            description: "شحن حسابات لعبة ludo king بسرعة وأمان.",
            buttonText: "عرض التفاصيل",
            Action: (formType) => { navigate('/payapp', { state: formType }) },
            image: Ludo
        },
        {
            title: "شحن mobile legend",
            formType: "MOBILE LEGENDS",
            description: "شحن حسابات لعبة mobile legend بسرعة وأمان.",
            buttonText: "عرض التفاصيل",
            Action: (formType) => { navigate('/payapp', { state: formType }) },
            image: MobileLegend
        },
        {
            title: "شحن project entropy",
            formType: "PROJECT ENTROPY",
            description: "شحن حسابات لعبة project entropy بسرعة وأمان.",
            buttonText: "عرض التفاصيل",
            Action: (formType) => { navigate('/payapp', { state: formType }) },
            image: ProjectEntropy
        },
        {
            title: "شحن whithout ",
            formType: "WHITHOUT SURVIVAL",
            description: "شحن حسابات لعبة whithout survivial بسرعة وأمان.",
            buttonText: "عرض التفاصيل",
            Action: (formType) => { navigate('/payapp', { state: formType }) },
            image: without
        },
    ];

    return [
        ...directTopUpGames,
        ...playDetails.filter((service) => !["PUBG", "FREE FIRE"].includes(service.formType)),
    ]; // إرجاع الـ array

}
