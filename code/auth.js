/**
 * Pekario Auth Module
 * Handles Hive Keychain and MetaMask login before the game starts.
 */

var PekarioAuth = {
    loggedIn: false,
    username: "",
    walletAddress: "",
    provider: "",  // "hive" or "metamask"

    startGame: function() {
        var canvas = document.getElementById("canvas");
        if (canvas) canvas.style.display = "block";

        if (!window.Enjine || !window.Mario || !window.Mario.LoadingState) {
            PekarioAuth.showError(
                "Game files failed to load (likely host timeout/522).<br>" +
                "Please refresh or use the GitHub Pages version."
            );
            return;
        }

        new Enjine.Application().Initialize(new Mario.LoadingState(), 320, 240);
    },

    // Called by the login buttons
    loginWithHive: function() {
        if (typeof window.hive_keychain === "undefined") {
            PekarioAuth.showError(
                "Hive Keychain extension not found.<br>" +
                "Please install it from <a href='https://hive-keychain.com' target='_blank'>hive-keychain.com</a>"
            );
            return;
        }

        var memo = "pekario-login-" + Date.now();
        hive_keychain.requestSignBuffer(null, memo, "Posting", function(response) {
            if (response.success) {
                PekarioAuth.username = response.data.username;
                PekarioAuth.provider = "hive";
                PekarioAuth.onLoginSuccess("HIVE: @" + response.data.username);
            } else {
                PekarioAuth.showError("Hive Keychain login cancelled or failed.<br>" + (response.message || ""));
            }
        });
    },

    loginWithMetaMask: function() {
        if (typeof window.ethereum === "undefined") {
            PekarioAuth.showError(
                "MetaMask not found.<br>" +
                "Please install it from <a href='https://metamask.io' target='_blank'>metamask.io</a>"
            );
            return;
        }

        window.ethereum.request({ method: "eth_requestAccounts" })
            .then(function(accounts) {
                if (accounts && accounts.length > 0) {
                    PekarioAuth.walletAddress = accounts[0];
                    PekarioAuth.provider = "metamask";
                    var short = accounts[0].slice(0, 6) + "..." + accounts[0].slice(-4);
                    PekarioAuth.onLoginSuccess("ETH: " + short);
                } else {
                    PekarioAuth.showError("No MetaMask accounts found.");
                }
            })
            .catch(function(err) {
                PekarioAuth.showError("MetaMask login failed: " + (err.message || err));
            });
    },

    onLoginSuccess: function(displayName) {
        PekarioAuth.loggedIn = true;
        PekarioAuth.displayName = displayName;

        // Update the UI
        var label = document.getElementById("pekario-user-label");
        if (label) label.textContent = "Logged in as: " + displayName;

        // Fade out overlay then start game
        var overlay = document.getElementById("pekario-login-overlay");
        if (overlay) {
            overlay.style.transition = "opacity 0.6s ease";
            overlay.style.opacity = "0";
            setTimeout(function() {
                overlay.style.display = "none";
                PekarioAuth.startGame();
            }, 650);
        }
    },

    skipLogin: function() {
        PekarioAuth.loggedIn = false;
        PekarioAuth.displayName = "Guest";

        // Fade out overlay then start game
        var overlay = document.getElementById("pekario-login-overlay");
        if (overlay) {
            overlay.style.transition = "opacity 0.6s ease";
            overlay.style.opacity = "0";
            setTimeout(function() {
                overlay.style.display = "none";
                PekarioAuth.startGame();
            }, 650);
        }
    },

    showError: function(msg) {
        var errDiv = document.getElementById("pekario-login-error");
        if (errDiv) {
            errDiv.innerHTML = msg;
            errDiv.style.display = "block";
        }
    }
};
