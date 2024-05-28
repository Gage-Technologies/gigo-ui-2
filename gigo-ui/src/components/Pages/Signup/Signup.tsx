'use client'
import * as React from "react";
import { useEffect, useState } from "react";
import * as moment from 'moment-timezone';
import {
    Box,
    Button,
    createTheme,
    CssBaseline,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    PaletteMode,
    Popover,
    Stack,
    TextField,
    ThemeProvider,
    Typography
} from "@mui/material";
import { theme, isHoliday, Holiday } from "@/theme";
import config from "@/config";
import ReactGA from "react-ga4";
// @ts-ignore
import GitHubLogin from 'react-login-github';
import LoginGithub from "@/components/Login/Github/LoginGithub";
import githubNameLight from "@/img/github/gh_name_light.png"
import githubNameDark from "@/img/github/gh_name_dark.png"
import githubLogoLight from "@/img/github/gh_logo_light.svg"
import githubLogoDark from "@/img/github/gh_logo_dark.svg"
import googleDark from "@/img/login/google-logo-white.png"
import googleLight from "@/img/login/google_light.png"
import googleLogo from "@/img/login/google_g.png"
import loginImg from "@/img/login/login_background.png";
import { useGoogleLogin } from "@react-oauth/google";
import SendIcon from "@mui/icons-material/Send";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { authorize, authorizeGithub, authorizeGoogle } from "@/services/auth";
import { LoadingButton } from "@mui/lab";
import Tag from "@/models/tag";
import swal from "sweetalert";
import Input from "@mui/material/Input";
import { Cancel } from "@mui/icons-material";
import Avataaar from "@/components/Avatar/avatar";
import ReactDOM from "react-dom";
import loginImg219 from "@/img/login/login_background-21-9.jpg";
import { useParams } from "react-router";
import { useTracking } from 'react-tracking';
import christmasLogin from "@/img/christmas-login.png";
import christmasLogin219 from "@/img/christmas-login-21-9.png";
import { RecordWebUsage, WebTrackingEvent } from "@/models/web_usage";
import { sleep } from "@/services/utils";
import { debounce } from "lodash";
import GigoCircleIcon from "@/icons/GigoCircleLogo";
import { DefaultTutorialState, TutorialState, initialAuthStateUpdate, selectAuthState, updateAuthState } from "@/reducers/auth/auth";
import { useAppDispatch, useAppSelector } from "@/reducers/hooks";
import fetchWithUpload from "@/services/chunkUpload";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";


interface TimezoneOption {
    value: string;
    label: string;
}


const formatTz = (tz: string): TimezoneOption => {
    const tzOffset = moment.tz(tz).format('Z');
    const value: string = parseInt(
        tzOffset
            .replace(':00', '.00')
            .replace(':15', '.25')
            .replace(':30', '.50')
            .replace(':45', '.75')
    ).toFixed(2);

    return {
        label: `${tz} (GMT${tzOffset})`,
        value: tz,
    };
};


function CreateNewAccount({params}: { params: { referrer: string | undefined } }) {
    const referralUser = params.referrer || ""

    console.log("referralUser", referralUser)

    const { trackEvent } = useTracking({}, {
        dispatch: (data: any) => {
            fetch(
                `${config.rootPath}/api/recordUsage`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data),
                    credentials: 'include'
                }
            )
        }
    });

    const searchParams = useSearchParams();
    const forwardPath = searchParams.get("forward") ? decodeURIComponent(searchParams.get("forward") || "") : "";

    let isMobile = searchParams.get("viewport") === "mobile";

    const styles = {
        themeButton: {
            display: "flex",
            justifyContent: "right"
        },
        createAccount: {
            display: "flex",
            marginLeft: "auto",
            marginTop: "3vh",
            paddingLeft: "40%",
            fontSize: "200%"
        },
        textField: {
            color: "error"
        },
        card: {
            backgroundColor: theme.palette.background
        }
    };

    const [firstName, setFirstName] = React.useState("")
    const [lastName, setLastName] = React.useState("")
    const [username, setUsername] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [validEmail, setValidEmail] = React.useState(false)
    const [number, setNumber] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [confirmPass, setConfirmPass] = React.useState("")
    const [external, setExternal] = React.useState(false)
    const [externalLogin, setExternalLogin] = React.useState("")
    const [externalToken, setExternalToken] = React.useState("")
    const [showPass, setShowPass] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [usage, setUsage] = React.useState("")
    const [proficiency, setProficiency] = React.useState<string>("")
    const [step, setStep] = React.useState(0)
    const [timezone, setTimezone] = React.useState<TimezoneOption | null>(formatTz(moment.tz.guess()))
    const [tagOptions, setTagOptions] = React.useState<Tag[]>([])
    const [bsTags, setBsTags] = React.useState<boolean>(false)
    const [interestTags, setInterestTags] = React.useState<Tag[]>([])
    const [avatarImage, setAvatarImage] = React.useState<Blob | null>(null)
    const [userCreated, setUserCreated] = React.useState(false)
    const [tagsExplanationAnchor, setTagsExplanationAnchor] = React.useState<HTMLElement | null>(null);
    const tagsExplanationPopoverOpen = Boolean(tagsExplanationAnchor);
    const [expExplanationAnchor, setExpExplanationAnchor] = React.useState<HTMLElement | null>(null);
    const expExplanationPopoverOpen = Boolean(expExplanationAnchor);
    const [languageExplanationAnchor, setLanguageExplanationAnchor] = React.useState<HTMLElement | null>(null);
    const languageExplanationPopoverOpen = Boolean(languageExplanationAnchor);
    const [unsafe, setUnsafe] = React.useState<boolean>(false)
    const [forcePass, setForcePass] = React.useState<boolean>(false)
    const [missingFirst, setMissingFirst] = React.useState<boolean>(false)
    const [missingLast, setMissingLast] = React.useState<boolean>(false)
    const [missingUser, setMissingUser] = React.useState<boolean>(false)
    const [invalidUsername, setInvalidUsername] = React.useState<boolean>(false)
    const [missingEmail, setMissingEmail] = React.useState<boolean>(false)
    const [missingPhone, setMissingPhone] = React.useState<boolean>(false)
    const [missingPassword, setMissingPassword] = React.useState<boolean>(false)
    const [missingConfirm, setMissingConfirm] = React.useState<boolean>(false)
    const [missingTimezone, setMissingTimezone] = React.useState<boolean>(false)
    const [lastStepDisabled, setLastStepDisabled] = React.useState<boolean>(true)
    const [Attributes, setAttributes] = useState({
        topType: "ShortHairDreads02",
        accessoriesType: "Prescription02",
        avatarRef: {},
        hairColor: "BrownDark",
        facialHairType: "Blank",
        clotheType: "Hoodie",
        clotheColor: "PastelBlue",
        eyeType: "Happy",
        eyebrowType: "Default",
        mouthType: "Smile",
        avatarStyle: "Circle",
        skinColor: "Light",
    });
    const [preferredLanguage, setPreferredLanguage] = useState<string>("");
    const [isAvatarInitialized, setIsAvatarInitialized] = useState<number>(0)

    const ShowButton = () => (
        <Button
            onClick={() => setShowPass(!showPass)}>
            {showPass ? <VisibilityIcon /> : <VisibilityOffIcon />}
        </Button>
    )

    ReactGA.initialize("G-38KBFJZ6M6");

    function hasLetters(str: string): boolean {
        return /[a-zA-Z]/.test(str);
    }

    const validateUser = async (): Promise<boolean> => {
        setLoading(true);

        let missingFields = [];
        // if (firstName === "") {
        //     setMissingFirst(true);
        //     missingFields.push('First Name');
        // }
        // if (lastName === "") {
        //     setMissingLast(true);
        //     missingFields.push('Last Name');
        // }
        if (username === "") {
            setMissingUser(true);
            missingFields.push('Username');
        }

        if (email === "") {
            setMissingEmail(true);
            missingFields.push('Email');
        }
        // if (number === "") {
        //     setMissingPhone(true);
        //     missingFields.push('Number');
        // }
        if (password === "") {
            setMissingPassword(true);
            missingFields.push('Password');
        }
        if (confirmPass === "") {
            setMissingConfirm(true);
            missingFields.push('Confirm Password');
        }
        // if (timezone === null) {
        //     setMissingTimezone(true);
        //     missingFields.push('Timezone');
        // }
        if (missingFields.length > 0) {
            setLoading(false);
            swal(`Please fill in the following fields:`, `${missingFields.join(', ')}`, "error");
            return false;
        }

        if (!hasLetters(username)) {
            swal("Username Invalid", "Username must contain at least one letter!", "error");
            setLoading(false)
            return false
        }

        if (password !== confirmPass) {
            //@ts-ignore
            swal("Passwords do not match", "", "error");
            setLoading(false)
            return false
        }

        if (password.length < 5) {
            //@ts-ignore
            swal("Sorry!", "Your password is too short. Try Another!", "error")
            setLoading(false)
            return false
        }

        // if (timezone === null) {
        //     //@ts-ignore
        //     swal("Timezone must be filled", "", "error")
        //     setLoading(false)
        //     return
        // }

        if (email !== "") {
            const emailIsValid = await verifyEmail(email);
            if (!emailIsValid) {
                setLoading(false);
                // setMissingEmail(true);
                return false;
            }
        }

        let res = await fetch(
            `${config.rootPath}/api/user/validateUser`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_name: username,
                    password: password,
                    email: email,
                    phone: "N/A",
                    timezone: timezone ? timezone.value : "America/Chicago",
                    force_pass: forcePass
                }),
                credentials: 'include'
            }
        ).then(async (response) => response.json())

        if (res["message"] === "a username is required for user creation") {
            swal("Please enter a username", "", "error")
            setLoading(false)
            setMissingUser(true)
        }
        if (res["message"] === "that username already exists") {
            swal("We're sorry!", "That username is already taken, please choose another", "error")
            setLoading(false)
            setMissingUser(true)
        }
        if (res["message"] === "password is too short for user creation") {
            swal("Sorry!", "Your password is too short. Try Another!", "error")
            setLoading(false)
            setMissingPassword(true)
        }
        if (res["message"] === "email is required for user creation") {
            swal("Please enter your email address", "", "error")
            setLoading(false)
            setMissingEmail(true)
        }
        if (res["message"] === "not a valid email address") {
            swal("We're sorry", "That does not seem to be a valid email address!", "error")
            setLoading(false)
            setMissingEmail(true)
        }
        if (res["message"] === "that email already exists") {
            swal("We're sorry", "This email already has an existing account", "error")
            setLoading(false)
            setMissingEmail(true)
        }
        if (res["message"] === "phone number is required for user creation") {
            swal("Please enter your phone number", "", "error")
            setLoading(false)
            setMissingPhone(true)
        }

        if (res["message"] === "unsafe password") {
            setUnsafe(true)
        }

        if (res["message"] === "User Cleared.") {
            // setStep(1)
            return true
        }
        return false
    }

    const accountCreation = async () => {
        if (avatarImage === null) {
            return
        }

        setLoading(true)


        let payload: RecordWebUsage = {
            host: window.location.host,
            event: WebTrackingEvent.SignupStart,
            timespent: 0,
            path: location.pathname,
            latitude: null,
            longitude: null,
            metadata: {
                mobile: isMobile,
                width: window.innerWidth,
                height: window.innerHeight,
                user_agent: navigator.userAgent,
                referrer: document.referrer,
            },
        }
        trackEvent(payload);

        if (password !== confirmPass) {
            //@ts-ignore
            swal("Passwords do not match")
            setLoading(false)
            return
        }

        if (password.length < 5) {
            //@ts-ignore
            swal("Passwords do not match")
            setLoading(false)
            return
        }

        if (timezone === null) {
            //@ts-ignore
            swal("Timezone must be filled")
            setLoading(false)
            return
        }

        let tagStringArray = interestTags.map(tag => tag.value).join(",")

        if (username.length > 50) {
            swal("Username must be less than 50 characters.")
            return
        }

        let params = {
            user_name: username,
            password: password,
            email: email,
            phone: "N/A",
            status: "basic",
            pfp_path: "",
            badges: [],
            tier: "1",
            coffee: "0",
            rank: "0",
            bio: "",
            first_name: firstName,
            last_name: lastName,
            external_auth: "",
            start_user_info: {
                usage: "I want to learn how to code by doing really cool projects.",
                proficiency: "Beginner",
                tags: "python,javascript,golang,web development,game development,machine learning,artificial intelligence",
                preferred_language: "Python, Javascript, Golang, Typescript"
            },
            timezone: timezone ? timezone.value : "America/Chicago",
            avatar_settings: {
                topType: Attributes.topType,
                accessoriesType: Attributes.accessoriesType,
                hairColor: Attributes.hairColor,
                facialHairType: Attributes.facialHairType,
                clotheType: Attributes.clotheType,
                clotheColor: Attributes.clotheColor,
                eyeType: Attributes.eyeType,
                eyebrowType: Attributes.eyebrowType,
                mouthType: Attributes.mouthType,
                avatarStyle: Attributes.avatarStyle,
                skinColor: Attributes.skinColor
            },
            force_pass: forcePass
        }

        if (referralUser !== "") {
            //@ts-ignore
            params["referral_user"] = referralUser
        }

        // duplicate the avatar image to prevent it from being modified
        let localCopy = new Blob([avatarImage], {type: avatarImage.type});

        let create = await fetchWithUpload(
            `${config.rootPath}/api/user/createNewUser`,
            localCopy,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params),
                credentials: 'include'
            },
            (res: any) => {
                if (res["message"] !== "User Created.") {
                    swal("Somethings went wrong...", res["message"], "error")
                }

                if (res === undefined) {
                    if (sessionStorage.getItem("alive") === null)
                        //@ts-ignore
                        swal(
                            "Server Error",
                            "We are unable to connect with the GIGO servers at this time. We're sorry for the inconvenience!"
                        );
                    return;
                }

                if (res["message"] === "User Created.") {
                    payload = {
                        host: window.location.host,
                        event: WebTrackingEvent.Signup,
                        timespent: 0,
                        path: location.pathname,
                        latitude: null,
                        longitude: null,
                        metadata: {
                            mobile: isMobile,
                            width: window.innerWidth,
                            height: window.innerHeight,
                            user_agent: navigator.userAgent,
                            referrer: document.referrer,
                        },
                    }
                    trackEvent(payload);

                    createLogin(true)
                }
            }
        )
    }

    const debouncedAccountCreation = debounce(accountCreation, 3000);

    const createLogin = async (newUser: boolean | null) => {
        let auth = await authorize(username, password);
        // @ts-ignore
        if (auth["user"] !== undefined) {
            let authState = Object.assign({}, initialAuthStateUpdate)
            authState.authenticated = true
            // @ts-ignore
            authState.expiration = auth["exp"]
            // @ts-ignore
            authState.id = auth["user"]
            // @ts-ignore
            authState.role = auth["user_status"]
            authState.email = auth["email"]
            authState.phone = auth["phone"]
            authState.userName = auth["user_name"]
            authState.thumbnail = auth["thumbnail"]
            authState.exclusiveContent = auth["exclusive_account"]
            authState.exclusiveAgreement = auth["exclusive_agreement"]
            authState.tutorialState = DefaultTutorialState
            dispatch(updateAuthState(authState))

            await sleep(1000)

            window.location.href = "/welcome?forward=" + encodeURIComponent(forwardPath || "")

            setLoading(false)
        } else {
            if (sessionStorage.getItem("alive") === null)
                //@ts-ignore
                swal("Sorry, we failed to log you in, please try again on login page");
            setLoading(false)
        }
    }

    /**
     * Handles a search for tags given a query string via the remote GIGO servers
     */
    const handleTagSearch = async (e: any) => {
        if (typeof e.target.value !== "string") {
            return
        }

        let res = await fetch(
            `${config.rootPath}/api/search/tags`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query: e.target.value,
                    skip: 0,
                    limit: 5,
                }),
                credentials: 'include'
            }
        ).then(async (response) => response.json())

        if (res === undefined) {
            swal("Server Error", "We can't get in touch with the GIGO servers right now. Sorry about that! " +
                "We'll get crackin' on that right away!")
            return
        }

        if (res["tags"] === undefined) {
            if (res["message"] === undefined) {
                swal("Server Error", "Man... We don't know what happened, but there's some weird stuff going on. " +
                    "We'll get working on this, come back in a few minutes")
                return
            }
            if (res["message"] === "incorrect type passed for field query") {
                return
            }
            swal("Server Error", res["message"])
            return
        }

        setTagOptions(res["tags"])
    }

    const dispatch = useAppDispatch();

    const authState = useAppSelector(selectAuthState);

    let router = useRouter();

    const [profile, setProfile] = useState([]);

    // transferring data from google login
    const onSuccessGoogle = async (usr: any) => {
        setExternal(true)
        setExternalToken(usr.access_token)
        setExternalLogin("Google")
    }

    const googleButton = useGoogleLogin({
        onSuccess: (usr: any) => onSuccessGoogle(usr)
    });

    const googleCreate = async () => {
        if (avatarImage === null) {
            return
        }

        setLoading(true)

        let payload: RecordWebUsage = {
            host: window.location.host,
            event: WebTrackingEvent.SignupStart,
            timespent: 0,
            path: location.pathname,
            latitude: null,
            longitude: null,
            metadata: {
                mobile: isMobile,
                width: window.innerWidth,
                height: window.innerHeight,
                user_agent: navigator.userAgent,
                referrer: document.referrer,
                auth_provider: "google"
            }
        }
        trackEvent(payload);


        if (password !== confirmPass || password.length < 5) {
            //@ts-ignore
            swal("Passwords do not match")
            setLoading(false)
            return
        }

        if (timezone === null) {
            //@ts-ignore
            swal("Timezone must be filled")
            setLoading(false)
            return
        }

        let tagStringArray = interestTags.map(tag => tag.value).join(",")

        let params = {
            external_auth: externalToken,
            password: password,
            start_user_info: {
                usage: "I want to learn how to code by doing really cool projects.",
                proficiency: "Beginner",
                tags: "python,javascript,golang,web development,game development,machine learning,artificial intelligence",
                preferred_language: "Python, Javascript, Golang, Typescript"
            },
            timezone: timezone ? timezone.value : "America/Chicago",
            avatar_settings: {
                topType: Attributes.topType,
                accessoriesType: Attributes.accessoriesType,
                hairColor: Attributes.hairColor,
                facialHairType: Attributes.facialHairType,
                clotheType: Attributes.clotheType,
                clotheColor: Attributes.clotheColor,
                eyeType: Attributes.eyeType,
                eyebrowType: Attributes.eyebrowType,
                mouthType: Attributes.mouthType,
                avatarStyle: Attributes.avatarStyle,
                skinColor: Attributes.skinColor
            }
        }

        if (referralUser !== "") {
            //@ts-ignore
            params["referral_user"] = referralUser
        }

        // duplicate the avatar image to prevent it from being modified
        let localCopy = new Blob([avatarImage], {type: avatarImage.type});

        let res = await fetchWithUpload(
            `${config.rootPath}/api/user/createNewGoogleUser`,
            localCopy,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params),
                credentials: 'include'
            },
            async (res: any) => {
                if (res["message"] !== "Google User Added.") {
                    swal("Somethings went wrong...", res["message"], "error")
                    setLoading(false)
                }

                if (res === undefined) {
                    if (sessionStorage.getItem("alive") === null)
                        //@ts-ignore
                        swal(
                            "Server Error",
                            "We are unable to connect with the GIGO servers at this time. We're sorry for the inconvenience!"
                        );
                    setLoading(false)
                    return;
                }

                if (res["message"] === "Google User Added.") {
                    payload = {
                        host: window.location.host,
                        event: WebTrackingEvent.Signup,
                        timespent: 0,
                        path: location.pathname,
                        latitude: null,
                        longitude: null,
                        metadata: {
                            mobile: isMobile,
                            width: window.innerWidth,
                            height: window.innerHeight,
                            user_agent: navigator.userAgent,
                            referrer: document.referrer,
                            auth_provider: "google"
                        }
                    }
                    trackEvent(payload);

                    let auth = await authorizeGoogle(externalToken, password);
                    // @ts-ignore
                    if (auth["user"] !== undefined) {
                        let authState = Object.assign({}, initialAuthStateUpdate)
                        authState.authenticated = true
                        // @ts-ignore
                        authState.expiration = auth["exp"]
                        // @ts-ignore
                        authState.id = auth["user"]
                        // @ts-ignore
                        authState.role = auth["user_status"]
                        authState.email = auth["email"]
                        authState.phone = auth["phone"]
                        authState.userName = auth["user_name"]
                        authState.thumbnail = auth["thumbnail"]
                        authState.backgroundColor = auth["color_palette"]
                        authState.backgroundName = auth["name"]
                        authState.backgroundRenderInFront = auth["render_in_front"]
                        authState.exclusiveContent = auth["exclusive_account"]
                        authState.exclusiveAgreement = auth["exclusive_agreement"]
                        authState.tutorialState = auth["tutorials"] as TutorialState
                        authState.tier = auth["tier"]
                        authState.inTrial = auth["in_trial"]
                        authState.alreadyCancelled = auth["already_cancelled"]
                        authState.hasPaymentInfo = auth["has_payment_info"]
                        authState.hasSubscription = auth["has_subscription"]
                        authState.usedFreeTrial = auth["used_free_trial"]
                        dispatch(updateAuthState(authState))

                        // this makes sure the dispatch occurs
                        await sleep(1000)

                        window.location.href = "/welcome?forward=" + encodeURIComponent(forwardPath || "")

                        setLoading(false)
                    } else {
                        if (sessionStorage.getItem("alive") === null)
                            //@ts-ignore
                            swal("Sorry, we failed to log you in, please try again on login page");
                        setLoading(false)
                    }
                }
            }
        )
    }

    const onSuccessGithub = async (gh: any) => {
        setExternal(true)
        setExternalToken(gh["code"])
        setExternalLogin("Github")
    }

    const githubCreate = async () => {
        if (avatarImage === null) {
            return
        }

        setLoading(true)

        let payload: RecordWebUsage = {
            host: window.location.host,
            event: WebTrackingEvent.SignupStart,
            timespent: 0,
            path: location.pathname,
            latitude: null,
            longitude: null,
            metadata: {
                mobile: isMobile,
                width: window.innerWidth,
                height: window.innerHeight,
                user_agent: navigator.userAgent,
                referrer: document.referrer,
                auth_provider: "github"
            },
        }
        trackEvent(payload);

        if (password !== confirmPass) {
            //@ts-ignore
            swal("Passwords do not match")
            setLoading(false)
            return
        }

        if (password.length < 5) {
            //@ts-ignore
            swal("Password is too short, try again");
            setLoading(false)
            return
        }

        if (timezone === null) {
            //@ts-ignore
            swal("Timezone must be filled")
            setLoading(false)
            return
        }

        let tagStringArray = interestTags.map(tag => tag.value).join(",")

        let params = {
            external_auth: externalToken,
            password: password,
            start_user_info: {
                usage: "I want to learn how to code by doing really cool projects.",
                proficiency: "Beginner",
                tags: "python,javascript,golang,web development,game development,machine learning,artificial intelligence",
                preferred_language: "Python, Javascript, Golang, Typescript"
            },
            timezone: timezone ? timezone.value : "America/Chicago",
            avatar_settings: {
                topType: Attributes.topType,
                accessoriesType: Attributes.accessoriesType,
                hairColor: Attributes.hairColor,
                facialHairType: Attributes.facialHairType,
                clotheType: Attributes.clotheType,
                clotheColor: Attributes.clotheColor,
                eyeType: Attributes.eyeType,
                eyebrowType: Attributes.eyebrowType,
                mouthType: Attributes.mouthType,
                avatarStyle: Attributes.avatarStyle,
                skinColor: Attributes.skinColor
            }
        }

        if (referralUser !== "") {
            //@ts-ignore
            params["referral_user"] = referralUser
        }

        // duplicate the avatar image to prevent it from being modified
        let localCopy = new Blob([avatarImage], {type: avatarImage.type});

        let res = await fetchWithUpload(
            `${config.rootPath}/api/user/createNewGithubUser`,
            localCopy,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params),
                credentials: 'include'
            },
            async (res: any) => {
                if (res["message"] !== "Github User Added.") {
                    swal("Somethings went wrong...", res["message"], "error")
                }

                if (res === undefined) {
                    if (sessionStorage.getItem("alive") === null)
                        //@ts-ignore
                        swal(
                            "Server Error",
                            "We are unable to connect with the GIGO servers at this time. We're sorry for the inconvenience!"
                        );
                    setLoading(false)
                    return;
                }

                if (res["message"] === "Github User Added.") {
                    payload = {
                        host: window.location.host,
                        event: WebTrackingEvent.Signup,
                        timespent: 0,
                        path: location.pathname,
                        latitude: null,
                        longitude: null,
                        metadata: {
                            mobile: isMobile,
                            width: window.innerWidth,
                            height: window.innerHeight,
                            user_agent: navigator.userAgent,
                            referrer: document.referrer,
                            auth_provider: "github"
                        },
                    }
                    trackEvent(payload);

                    let auth = await authorizeGithub(password);
                    // @ts-ignore
                    if (auth["user"] !== undefined) {
                        let authState = Object.assign({}, initialAuthStateUpdate)
                        authState.authenticated = true
                        // @ts-ignore
                        authState.expiration = auth["exp"]
                        // @ts-ignore
                        authState.id = auth["user"]
                        // @ts-ignore
                        authState.role = auth["user_status"]
                        authState.email = auth["email"]
                        authState.phone = auth["phone"]
                        authState.userName = auth["user_name"]
                        authState.thumbnail = auth["thumbnail"]
                        authState.backgroundColor = auth["color_palette"]
                        authState.backgroundName = auth["name"]
                        authState.backgroundRenderInFront = auth["render_in_front"]
                        authState.exclusiveContent = auth["exclusive_account"]
                        authState.exclusiveAgreement = auth["exclusive_agreement"]
                        authState.tutorialState = auth["tutorials"] as TutorialState
                        authState.tier = auth["tier"]
                        authState.inTrial = auth["in_trial"]
                        authState.alreadyCancelled = auth["already_cancelled"]
                        authState.hasPaymentInfo = auth["has_payment_info"]
                        authState.hasSubscription = auth["has_subscription"]
                        authState.usedFreeTrial = auth["used_free_trial"]
                        dispatch(updateAuthState(authState))

                        await sleep(1000)

                        window.location.href = "/welcome?forward=" + encodeURIComponent(forwardPath || "")

                        setLoading(false)
                    } else {
                        if (sessionStorage.getItem("alive") === null)
                            //@ts-ignore
                            swal("Sorry, we failed to log you in, please try again on login page");
                        setLoading(false)
                    }
                }
            }
        )
    };

    const verifyEmail = async (emailParam: string) => {
        let isValid = false;

        if (emailParam === "") {
            //@ts-ignore
            swal("You must input a valid email", "", "failed");
            return isValid;
        }

        let res = await fetch(
            `${config.rootPath}/api/email/verify`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: emailParam
                }),
                credentials: 'include'
            }
        ).then(async (response) => response.json())

        if (res["valid"] === undefined) {
            setValidEmail(false);
            //@ts-ignore
            swal("An unexpected error has occurred", "We're sorry, we'll get right on that!", "error");
        } else if (res["valid"] === false) {
            setValidEmail(false);
            //@ts-ignore
            swal("Invalid Email Address", "", "Please enter a valid email address and retry");
        } else if (res["valid"] === true) {
            setValidEmail(true);
            isValid = true;
        }

        return isValid;
    }


    const getTimeZoneOptions = (showTimezoneOffset?: boolean) => {
        const timeZones = moment.tz.names();
        const offsetTmz: TimezoneOption[] = [];

        for (const i in timeZones) {
            const tz = timeZones[i];
            const tzOffset = moment.tz(tz).format('Z');
            const value: string = parseInt(
                tzOffset
                    .replace(':00', '.00')
                    .replace(':15', '.25')
                    .replace(':30', '.50')
                    .replace(':45', '.75')
            ).toFixed(2);

            const timeZoneOption: TimezoneOption = {
                label: showTimezoneOffset ? `${tz} (GMT${tzOffset})` : tz,
                value: tz
            };
            offsetTmz.push(timeZoneOption);
        }

        return offsetTmz;
    };

    let handleForce = () => {
        setForcePass(true)
        setUnsafe(false)
        setLoading(false)
    }

    const renderInput = ({ ...props }) => {
        let { onChange, value, ...other } = props;
        return (
            <Input
                onChange={onChange}
                value={value}
                style={{ color: theme.palette.text.primary, width: "100%" }}
                {...other}
            />
        );
    }


    let renderTagsExplanationPopover = () => {
        return (
            <div>
                <Typography
                    aria-owns={tagsExplanationPopoverOpen ? 'tags-explanation-popup' : undefined}
                    aria-haspopup="true"
                    onMouseEnter={(event: React.MouseEvent<HTMLElement>) => {
                        setTagsExplanationAnchor(event.currentTarget);
                    }}
                    onMouseLeave={(event: React.MouseEvent<HTMLElement>) => {
                        setTagsExplanationAnchor(null);
                    }}
                    sx={{
                        color: theme.palette.primary.main,
                        fontSize: 11,
                        marginLeft: "3.5vw",
                    }}
                >
                    Learn more about Tags
                </Typography>
                <Popover
                    id="tags-explanation-popup"
                    sx={{
                        pointerEvents: 'none',
                    }}
                    open={tagsExplanationPopoverOpen}
                    anchorEl={tagsExplanationAnchor}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    onClose={async () => {
                        setTagsExplanationAnchor(null);
                    }}
                    disableRestoreFocus
                >
                    <div style={{
                        width: "45vw",
                        paddingTop: "5px",
                        paddingLeft: "10px",
                        paddingRight: "10px"
                    }}>
                        <div style={{
                            fontSize: 12,
                            textOverflow: "wrap"
                        }}>
                            Tags are a powerful tool to help us better understand your interests and provide you with
                            personalized recommendations. By providing us with some tags that you are interested in, we
                            can ensure that the challenges and other entities we recommend to you will be relevant to
                            what matters most. We look forward to getting acquainted and helping make your experience
                            more enjoyable!
                        </div>
                    </div>
                </Popover>
            </div>
        )
    }

    let renderExperienceExplanationPopover = () => {
        return (
            <div>
                <Typography
                    aria-owns={expExplanationPopoverOpen ? 'exp-explanation-popup' : undefined}
                    aria-haspopup="true"
                    onMouseEnter={(event: React.MouseEvent<HTMLElement>) => {
                        setExpExplanationAnchor(event.currentTarget);
                    }}
                    onMouseLeave={(event: React.MouseEvent<HTMLElement>) => {
                        setExpExplanationAnchor(null);
                    }}
                    sx={{
                        color: theme.palette.primary.main,
                        fontSize: 11,
                        marginLeft: "3.5vw",
                    }}
                >
                    Learn more about Experience Levels
                </Typography>
                <Popover
                    id="exp-explanation-popup"
                    sx={{
                        pointerEvents: 'none',
                    }}
                    open={expExplanationPopoverOpen}
                    anchorEl={expExplanationAnchor}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    onClose={async () => {
                        setExpExplanationAnchor(null);
                    }}
                    disableRestoreFocus
                >
                    <div style={{
                        width: "45vw",
                        paddingTop: "5px",
                        paddingLeft: "10px",
                        paddingRight: "10px"
                    }}>
                        <div style={{
                            fontSize: 12,
                            textOverflow: "wrap"
                        }}>
                            Experience level selection helps us better understand your familiarity with programming
                            concepts and provides a basis for determining what Renown your recommended challenges should
                            have. As a new user of GIGO, you can benefit from our Renown system which is designed to
                            accurately measure your proficiency and progress. By continuing to complete more challenges,
                            you will be able to move up in tiers of Renown - not only helping you determine if you are
                            skilled enough to attempt certain challenges but also providing recognition within the
                            community for your hard work & achievements.
                        </div>
                    </div>
                </Popover>
            </div>
        )
    }

    let renderLanguageExplanationPopover = () => {
        return (
            <div>
                <Typography
                    aria-owns={languageExplanationPopoverOpen ? 'language-explanation-popup' : undefined}
                    aria-haspopup="true"
                    onMouseEnter={(event: React.MouseEvent<HTMLElement>) => {
                        setLanguageExplanationAnchor(event.currentTarget);
                    }}
                    onMouseLeave={(event: React.MouseEvent<HTMLElement>) => {
                        setLanguageExplanationAnchor(null);
                    }}
                    sx={{
                        color: theme.palette.primary.main,
                        fontSize: 11,
                        marginLeft: "3.5vw",
                    }}
                >
                    Learn more about Preferred Language
                </Typography>
                <Popover
                    id="language-explanation-popup"
                    sx={{
                        pointerEvents: 'none',
                    }}
                    open={languageExplanationPopoverOpen}
                    anchorEl={languageExplanationAnchor}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    onClose={async () => {
                        setLanguageExplanationAnchor(null);
                    }}
                    disableRestoreFocus
                >
                    <div style={{
                        width: "45vw",
                        paddingTop: "5px",
                        paddingLeft: "10px",
                        paddingRight: "10px"
                    }}>
                        <div style={{
                            fontSize: 12,
                            textOverflow: "wrap"
                        }}>
                            Your preferred programming language helps us tailor your experience on our platform. By
                            selecting a preferred language, we can recommend projects, tutorials, and other resources
                            that are most relevant to you.
                        </div>
                    </div>
                </Popover>
            </div>
        )
    }


    const onFailureGithub = (gh: any) => {
        ;
    };

    const Tags = () => {
        return (
            <Box
                sx={{
                    background: "#283240",
                    height: "100%",
                    display: "flex",
                    padding: "0.4rem",
                    margin: "0 0.5rem 0 0",
                    justifyContent: "center",
                    alignContent: "center",
                    color: "#ffffff",
                }}
            >
                <Stack direction='row' gap={1}>
                    <Typography>Tags</Typography>
                    <Cancel />
                </Stack>
            </Box>
        );
    };

    const setAvatar = (e: {
        topType: string;
        accessoriesType: string;
        avatarRef: object,
        hairColor: string;
        facialHairType: string;
        clotheType: string;
        clotheColor: string;
        eyeType: string;
        eyebrowType: string;
        mouthType: string;
        avatarStyle: string;
        skinColor: string;
    }) => {
        setAttributes(e)
        // @ts-ignore
        let data = ReactDOM.findDOMNode(e.avatarRef.current).outerHTML;
        let svg = new Blob([data], { type: "image/svg+xml" })
        setAvatarImage(svg)
        setIsAvatarInitialized(isAvatarInitialized + 1)
        // setLastStepDisabled(false)
    }

    // let renderAvatar = () => {
    //     return (
    //         <form>
    //
    //             <Avataaar id={"avatar-container"} value={Attributes} sx={{ width: !isMobile ? "auto" : "80%" }} onChange={(e: React.SetStateAction<{ topType: string; accessoriesType: string; avatarRef: object, hairColor: string; facialHairType: string; clotheType: string; clotheColor: string; eyeType: string; eyebrowType: string; mouthType: string; avatarStyle: string; skinColor: string; }>) => setAvatar(e)} />
    //             <div style={!isMobile ? { width: "100%", display: "flex", justifyContent: "center", paddingTop: "1vh", } : { width: "80%", display: "flex", justifyContent: "space-evenly", paddingTop: "1vh", flexDirection: "row" }}>
    //                 <Button id={"last-step"}
    //                     onClick={() => {
    //                         setStep(0)
    //                     }}
    //                     sx={!isMobile ? {
    //                         // paddingLeft: "5vw",
    //                         // paddingTop: "1vh",
    //                         // marginLeft: "1vw",
    //                         // width: !isMobile ? "auto" : "1vw",
    //                         // color: theme.palette.primary.main,
    //                         // top: "53vh",
    //                         // left: "5vw",
    //                     } : {}}
    //                 >
    //                     <ArrowBack style={{ color: theme.palette.primary.main }} /> Back
    //                 </Button>
    //                 <LoadingButton
    //                     loading={loading}
    //                     onClick={() => {
    //                         setStep(2)
    //                     }}
    //                     variant={`contained`}
    //                     color={"primary"}
    //                     // endIcon={<LockPersonIcon/>}
    //                     style={!isMobile ? {
    //                         width: '15vw',
    //                         borderRadius: 100,
    //                         height: "5vh",
    //                         paddingTop: "1vh",
    //                         justifyContent: "center",
    //                         paddingBottom: "5px"
    //                     } : {
    //                         width: '100px',
    //                         borderRadius: 100,
    //                         height: "5vh",
    //                         paddingTop: "1vh",
    //                         paddingBottom: "5px"
    //                     }}
    //                     disabled={lastStepDisabled}
    //                 >
    //                     Last Step
    //                 </LoadingButton>
    //             </div>
    //             <div style={{ height: "10px" }} />
    //         </form>
    //     )
    // }

    function hexToRGBA(hex: string, alpha: string | number) {
        let r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);

        if (alpha) {
            return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
        } else {
            return "rgb(" + r + ", " + g + ", " + b + ")";
        }
    }

    const languageOptions = [
        "Any",
        "I'm not sure",
        "Go",
        "Python",
        "JavaScript",
        "Typescript",
        "Rust",
        "Java",
        "C#",
        "SQL",
        "HTML",
        "Swift",
        "Ruby",
        "C++",
        "Other"
    ].sort();

    // let renderQuestions = () => {
    //     return (
    //         <form>
    //             <Button
    //                 onClick={() => {
    //                     setStep(0)
    //                 }}
    //                 sx={{
    //                     marginLeft: "1vw",
    //                 }}
    //             >
    //                 <ArrowBack /> Go Back
    //             </Button>
    //             <div style={{ background: hexToRGBA(theme.palette.primary.light, 0.7), color: theme.palette.text.primary, padding: "20px", textAlign: "center", fontWeight: "bold", fontSize: "16px", boxShadow: "0px 0px 10px 2px black" }}>
    //                 We use cutting edge Magic to understand your input and serve you personalized projects.
    //             </div>
    //             <TextField
    //                 id={"Usage"}
    //                 variant={`outlined`}
    //                 color={"primary"}
    //                 label={"Why are you using GIGO?"}
    //                 required={true}
    //                 margin={`normal`}
    //                 type={`text`}
    //                 multiline={true}
    //                 value={usage}
    //                 placeholder={"A short summary of what you want to get out of GIGO. This will help us provide you with relevant content."}
    //                 fullWidth={true}
    //                 minRows={3}
    //                 sx={!isMobile ? {
    //                     width: "28vw",
    //                     marginLeft: "3.5vw",
    //                     mt: "2.5vh"
    //                 } : { width: "90%", marginLeft: "4.5vw", mt: "2.5vh" }}
    //                 onChange={e => setUsage(e.target.value)}
    //             >
    //             </TextField>
    //             <Autocomplete
    //                 multiple
    //                 limitTags={5}
    //                 id="tagInputAutocomplete"
    //                 options={tagOptions}
    //                 getOptionLabel={(option: Tag) => {
    //                     return option.value
    //                 }}
    //                 isOptionEqualToValue={(option: Tag, value: Tag) => {
    //                     return option._id === value._id;
    //                 }}
    //                 renderInput={(params) => (
    //                     <TextField {...params} label="Interest Tags" placeholder="Interest Tags" />
    //                 )}
    //                 onInputChange={(e) => {
    //                     handleTagSearch(e)
    //                 }}
    //                 // @ts-ignore
    //                 onChange={(e: SyntheticEvent, value: Array<Tag>) => {
    //                     setInterestTags(value)
    //                 }}
    //                 // @ts-ignore
    //                 value={interestTags}
    //                 sx={!isMobile ? {
    //                     width: "28vw",
    //                     marginLeft: "3.5vw",
    //                     mt: "2.5vh"
    //                 } : { width: "90%", marginLeft: "4.5vw", mt: "2.5vh" }}
    //             />
    //             {renderTagsExplanationPopover()}
    //             <TextField
    //                 select
    //                 id={"newUserExperienceLevel"}
    //                 label={"Experience Level"}
    //                 required={true}
    //                 value={proficiency}
    //                 onChange={e => setProficiency(e.target.value as string)}
    //                 sx={!isMobile ? {
    //                     width: "28vw",
    //                     marginLeft: "3.5vw",
    //                     mt: "2.5vh"
    //                 } : { width: "90%", marginLeft: "4.5vw", mt: "2.5vh" }}
    //             >
    //                 <MenuItem value={"Beginner"}>Beginner</MenuItem>
    //                 <MenuItem value={"Intermediate"}>Intermediate</MenuItem>
    //                 <MenuItem value={"Advanced"}>Advanced</MenuItem>
    //             </TextField>
    //             {renderExperienceExplanationPopover()}
    //             <TextField
    //                 select
    //                 id={"newUserPreferredLanguage"}
    //                 label={"Preferred Language"}
    //                 required={true}
    //                 value={preferredLanguage}
    //                 onChange={e => setPreferredLanguage(e.target.value as string)}
    //                 sx={!isMobile ? {
    //                     width: "28vw",
    //                     marginLeft: "3.5vw",
    //                     mt: "2.5vh"
    //                 } : { width: "90%", marginLeft: "4.5vw", mt: "2.5vh" }}
    //                 SelectProps={{
    //                     MenuProps: {
    //                         PaperProps: {
    //                             style: {
    //                                 maxHeight: '20%',
    //                                 overflow: 'auto',
    //                             }
    //                         }
    //                     }
    //                 }}
    //             >
    //                 {languageOptions.map((lang, index) => (
    //                     <MenuItem key={index} value={lang}>
    //                         {lang}
    //                     </MenuItem>
    //                 ))}
    //             </TextField>
    //             {renderLanguageExplanationPopover()}
    //             <LoadingButton
    //                 loading={loading}
    //                 onClick={() => {
    //                     (!external) ? accountCreation() : externalLogin === "Google" ? googleCreate() : githubCreate()
    //                 }}
    //                 variant={`contained`}
    //                 color={"primary"}
    //                 // endIcon={<LockPersonIcon/>}
    //                 sx={!isMobile ? {
    //                     width: '15vw',
    //                     borderRadius: 1,
    //                     height: "5vh",
    //                     justifyContent: "center",
    //                     marginLeft: "10vw",
    //                     mt: "2.5vh",
    //                     marginBottom: "30px",
    //                 } : {
    //                     width: 'auto',
    //                     borderRadius: 1,
    //                     height: "5vh",
    //                     justifyContent: "center",
    //                     marginLeft: "23vw",
    //                     mt: "2.5vh",
    //                     marginBottom: "30px",
    //                 }}
    //             >
    //                 Create Account
    //             </LoadingButton>
    //         </form>
    //     )
    // }

    let renderCreateForm = () => {
        return (
            <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
                justifyContent={"center"}
                sx={{
                    width: "100%",
                    height: "100%",
                }}
            >
                <Box
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    sx={{
                        backgroundColor: theme.palette.background.default,
                        p: isMobile ? 2 : 4,
                        borderRadius: 2,
                        maxWidth: "calc(100vw - 40px)",
                    }}
                >
                    <Typography component={"div"} variant={"h5"} sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                    }}>
                        Create Account
                    </Typography>
                    <form style={{
                        height: "auto",
                        display: "flex",
                        flexDirection: "column",
                        alignContent: "center",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                    }}>
                        <TextField
                            id={"Username"}
                            error={username === "" ? missingUser : invalidUsername}
                            variant={`outlined`}
                            color={"primary"}
                            label={"Username"}
                            required={true}
                            margin={`normal`}
                            size={!isMobile ? `medium` : `small`}
                            sx={{
                                maxWidth: "375px",
                                minWidth: "275px",
                            }}
                            value={username}
                            onChange={e => {
                                if (e.target.value.includes(" ") || e.target.value.includes("@") || e.target.value.length > 25) {
                                    setInvalidUsername(true);
                                } else {
                                    setInvalidUsername(false)
                                }
                                setUsername(e.target.value)
                            }}
                            helperText={invalidUsername ? "Must be <= 25 chars with no spaces or @ symbols" : undefined}
                        >
                        </TextField>
                        <TextField
                            id={"Email"}
                            error={email === "" ? missingEmail : false}
                            variant={`outlined`}
                            color={"primary"}
                            label={"Email"}
                            required={true}
                            margin={`normal`}
                            type={`text`}
                            size={!isMobile ? `medium` : `small`}
                            sx={{
                                maxWidth: "375px",
                                minWidth: "275px",
                            }}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        >
                        </TextField>
                        <TextField
                            id={"Password"}
                            error={password === "" ? missingPassword : false}
                            variant={`outlined`}
                            type={showPass ? `text` : `password`}
                            color={
                                (password.length > 5 && password !== "") ? "success" : "error"
                            }
                            label={"Password"}
                            required={true}
                            margin={`normal`}
                            size={!isMobile ? `medium` : `small`}
                            sx={{
                                maxWidth: "375px",
                                minWidth: "275px",
                            }}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            InputProps={{
                                endAdornment: <ShowButton />
                            }}
                        >
                        </TextField>
                        <TextField
                            id={"ReTypePassword"}
                            error={confirmPass === "" ? missingConfirm : false}
                            variant={`outlined`}
                            type={showPass ? `text` : `password`}
                            color={
                                (password === confirmPass && password !== "") ? "success" : "error"
                            }
                            label={"Confirm Password"}
                            required={true}
                            margin={`normal`}
                            size={!isMobile ? `medium` : `small`}
                            sx={{
                                maxWidth: "375px",
                                minWidth: "275px",
                            }}
                            value={confirmPass}
                            onChange={e => setConfirmPass(e.target.value)}
                        >
                        </TextField>
                        <LoadingButton
                            loading={loading}
                            onClick={async () => {
                                let ok = await validateUser()
                                if (ok) {
                                    debouncedAccountCreation()
                                }
                            }}
                            variant={`contained`}
                            color={"primary"}
                            disabled={(
                                missingEmail ||
                                missingPassword ||
                                missingConfirm ||
                                invalidUsername ||
                                username === "" ||
                                email === "" ||
                                password === "" ||
                                confirmPass === "" ||
                                password !== confirmPass
                            )}
                            // endIcon={<LockPersonIcon/>}
                            sx={{
                                borderRadius: 1,
                                minHeight: "5vh",
                                minWidth: '15vw',
                                justifyContent: "center",
                                lineHeight: "35px",
                            }}
                        >
                            Create Account
                        </LoadingButton>
                        <Dialog
                            open={unsafe}
                            onClose={() => setUnsafe(false)}
                        >
                            <DialogTitle>{"Unsafe Password"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Hey, we found that your password is included in a list of compromised
                                    passwords. It&apos;s important to keep your account secure, so we strongly
                                    suggest that you change your password. You can still continue using your
                                    current password, but just know that it carries a higher risk.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setUnsafe(false)} color="primary">Change
                                    Password</Button>
                                <Button onClick={handleForce} color={"error"}>
                                    Force Un-Safe Password
                                </Button>
                            </DialogActions>
                        </Dialog>
                        <Typography component={"div"} variant={"h6"} sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            paddingTop: "15px"
                        }}>
                            or register with:
                        </Typography>
                        <Grid container sx={{
                            justifyContent: "center",
                            width: "100%",
                            marginBottom: "5px"
                        }} direction="row" alignItems="center">
                            <Button onClick={() => googleButton()} sx={{
                                padding: "15px"
                            }}>
                                <Box display="inline-flex" justifyContent="center" alignItems="center" alignContent="center">
                                    <Box display={"flex"} justifyContent="center" alignItems="center" alignContent="center">
                                        <Image
                                            width={40}
                                            height={40}
                                            alt={"Google Logo"}
                                            src={googleLogo}
                                        />
                                    </Box>
                                    <Box display={"flex"} justifyContent="center" alignItems="center" alignContent="center" sx={{ height: "100%", marginLeft: "5px" }}>
                                        <Image
                                            width={72}
                                            height={25}
                                            alt={"Google Name"}
                                            src={theme.palette.mode === "light" ? googleLight : googleDark}
                                        />
                                    </Box>
                                </Box>
                            </Button>
                            <LoginGithub
                                color={"primary"}
                                sx={{
                                    // width: !isMobile ? '5vw' : "20vw",
                                    justifyContent: "center",
                                }}
                                clientId="9ac1616be22aebfdeb3e"
                                // TODO change redirect URI for production
                                redirectUri={""}
                                onSuccess={onSuccessGithub}
                                onFailure={onFailureGithub}
                            >
                                <Box display="inline-flex" justifyContent="center" alignItems="center" alignContent="center">
                                    <Box display={"flex"} justifyContent="center" alignItems="center" alignContent="center">
                                        <Image
                                            width={40}
                                            height={40}
                                            alt={"Github Logo"}
                                            src={theme.palette.mode === "light" ? githubLogoDark : githubLogoLight}
                                        />
                                    </Box>
                                    <Box display={"flex"} justifyContent="center" alignItems="center" alignContent="center" sx={{ height: "100%", marginLeft: "5px" }}>
                                        <Image
                                            width={68}
                                            height={28}
                                            alt={"Github Name"}
                                            src={theme.palette.mode === "light" ? githubNameDark : githubNameLight}
                                        />
                                    </Box>
                                </Box>
                            </LoginGithub>
                        </Grid>
                        <Typography sx={{
                            display: "flex",
                            flexDirection: "row",
                            width: "100%",
                            height: "1%",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <Typography variant="h5" component="div"
                                sx={{ fontSize: "75%" }}
                            >
                                Already have an account?
                            </Typography>
                            <Button
                                onClick={async () => {
                                    router.push("/login?forward=" + encodeURIComponent(forwardPath || ""))
                                }}
                                variant={`text`}
                                color={"primary"}
                            >
                                Login
                            </Button>
                        </Typography>
                    </form>
                </Box>
            </Box>
        )
    }

    const aspectRatio = useAspectRatio();

    let renderExternal = () => {
        return (
            step === 0 ? (
                <Box sx={{
                    display: 'flex', // Enable Flexbox
                    flexDirection: 'column', // Stack children vertically
                    justifyContent: 'center', // Center children vertically in the container
                    alignItems: 'center', // Center children horizontally in the container
                    height: '100vh', // Full viewport height
                }}>
                    <Grid container justifyContent="center">
                        <Grid container
                            sx={{
                                justifyContent: "center",
                                outlineColor: "black",
                                width: !isMobile ? "35%" : "90%",
                                borderRadius: 1,
                                backgroundColor: theme.palette.background.default,
                                paddingBottom: "1.5vw"
                            }} direction="column" alignItems="center"
                        >
                            <Typography component={"div"} variant={"h5"} sx={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                paddingTop: "10px",
                            }}>
                                Create a Password
                            </Typography>
                            <TextField
                                id={"Password"}
                                variant={`outlined`}
                                type={showPass ? `text` : `password`}
                                color={
                                    (password.length > 5 && password !== "") ? "success" : "error"
                                }
                                label={"Password"}
                                required={true}
                                margin={`normal`}
                                sx={{
                                    width: !isMobile ? "28vw" : "80vw",
                                    mt: "2.5vh"
                                }}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                InputProps={{
                                    endAdornment: <ShowButton />
                                }}
                            >
                            </TextField>
                            <TextField
                                id={"ReTypePassword"}
                                variant={`outlined`}
                                type={showPass ? `text` : `password`}
                                color={
                                    (password === confirmPass && password !== "") ? "success" : "error"
                                }
                                label={"Confirm Password"}
                                required={true}
                                margin={`normal`}
                                onKeyDown={
                                    e => {
                                        if (e.key === "Enter") {
                                            // setStep(1)
                                            externalLogin === "Google" ? googleCreate() : githubCreate()
                                        }
                                    }}
                                sx={{
                                    width: !isMobile ? "28vw" : "80vw",
                                    mt: "2.5vh"
                                }}
                                value={confirmPass}
                                onChange={e => setConfirmPass(e.target.value)}
                                helperText={"We use this password to encrypt sensitive information."}
                            >
                            </TextField>
                            {/* <Autocomplete
                                id="timezoneInputSelect"
                                options={getTimeZoneOptions(true)}
                                getOptionLabel={(option) => option.label}
                                onChange={(e: SyntheticEvent, value: TimezoneOption | null) => {
                                    if (value === null) {
                                        setTimezone(null)
                                    }
                                    setTimezone(value)
                                }}
                                isOptionEqualToValue={(option: TimezoneOption, value: TimezoneOption) => {
                                    return option.value === value.value;
                                }}
                                value={timezone}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Timezone"
                                    />
                                )}
                                sx={{
                                    width: !isMobile ? "28vw" : "80vw",
                                    mt: "2.5vh"
                                }}
                            /> */}
                            <Button
                                onClick={() => {
                                    // setStep(1)
                                    externalLogin === "Google" ? googleCreate() : githubCreate()
                                }}
                                variant={`contained`}
                                color={"primary"}
                                endIcon={<SendIcon />}
                                sx={{
                                    borderRadius: 1,
                                    minHeight: "5vh",
                                    minWidth: '15vw',
                                    justifyContent: "center",
                                    lineHeight: "35px",
                                    mt: "2.5vh"
                                }}
                                disabled={loading}
                            >
                                Create Account
                            </Button>
                            <Typography variant="h5" component="div"
                                sx={{ fontSize: "75%" }}
                            >
                                Already linked your account?
                            </Typography>
                            <Button
                                onClick={async () => {
                                    router.push("/login")
                                }}
                                variant={`text`}
                                color={"primary"}
                            >
                                sign in
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            ) : (
                <Grid container justifyContent="center" sx={{
                    paddingTop: "25px",
                }}>
                    <Grid container
                        sx={{
                            justifyContent: "center",
                            outlineColor: "black",
                            width: "35%",
                            borderRadius: 1,
                            backgroundColor: theme.palette.background.default,
                            height: "100%",
                        }} direction="column" alignItems="center"
                    >
                        {/* {renderQuestions()} */}
                    </Grid>
                </Grid>
            )
        )
    }

    // initialize tags if there are no values
    if (tagOptions.length === 0 && !bsTags) {
        setBsTags(true)
        handleTagSearch({ target: { value: "" } })
    }

    const renderLanding = () => {
        const holiday = isHoliday()
        if (aspectRatio === "21:9") {
            if (holiday === Holiday.Christmas) {
                return `${config.rootPath}/cloudstore/images/christmas-login-21-9.png`
            }
            return `${config.rootPath}/cloudstore/images/login_background-21-9.jpg`
        } else {
            if (holiday === Holiday.Christmas) {
                return `${config.rootPath}/cloudstore/images/christmas-login.png`
            }
            return `${config.rootPath}/cloudstore/images/login_background.jpg`
        }
    }

    return (
        <div
            style={{
                backgroundColor: "black",
                backgroundImage: `url(${renderLanding()})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                width: '100vw',
                height: '100vh'
            }}>
            {isAvatarInitialized <= 2 && (
                <div style={{ display: 'none' }}>
                    <Avataaar id={"avatar-container"} value={Attributes}
                        sx={{ width: !isMobile ? "auto" : "80%" }}
                        onChange={(e: any) => setAvatar(e)} creation={true} />
                </div>
            )}
            <ThemeProvider theme={theme}>
                <CssBaseline>
                    {!isMobile && (
                        <Box display={"inline-flex"} sx={{
                            position: 'absolute',
                            top: '20px', // Adjust the top position as needed
                            left: '35px', // Adjust the left position as needed
                            height: 'auto',
                            color: "white"
                        }}>
                            <GigoCircleIcon
                                sx={{
                                    width: '120px',
                                    height: 'auto', // Maintain aspect ratio
                                    color: 'white',
                                }}
                            />
                            {/* Slogan */}
                            <Typography
                                variant="body1"
                                style={{
                                    paddingTop: "15px",
                                    paddingLeft: "15px",
                                    fontWeight: 'bold', // Customize the text style,
                                    fontSize: '2em',
                                    color: 'white',
                                }}
                            >
                                works on our machine.
                            </Typography>
                        </Box>
                    )}
                    {(!external) ? renderCreateForm() : renderExternal()}
                </CssBaseline>
            </ThemeProvider>
        </div>
    );
}

function useAspectRatio() {
    const [aspectRatio, setAspectRatio] = useState('');

    useEffect(() => {
        function gcd(a: any, b: any): any {
            return b === 0 ? a : gcd(b, a % b);
        }

        function calculateAspectRatio() {
            const width = window.screen.width;
            const height = window.screen.height;
            let divisor = gcd(width, height);
            // Dividing by GCD and truncating into integers
            let simplifiedWidth = Math.trunc(width / divisor);
            let simplifiedHeight = Math.trunc(height / divisor);

            divisor = Math.ceil(simplifiedWidth / simplifiedHeight);
            simplifiedWidth = Math.trunc(simplifiedWidth / divisor);
            simplifiedHeight = Math.trunc(simplifiedHeight / divisor);
            setAspectRatio(`${simplifiedWidth}:${simplifiedHeight}`);
        }

        calculateAspectRatio();

        window.addEventListener('resize', calculateAspectRatio);


        return () => {
            window.removeEventListener('resize', calculateAspectRatio);
        };
    }, []);

    return aspectRatio;
}

export default CreateNewAccount;
