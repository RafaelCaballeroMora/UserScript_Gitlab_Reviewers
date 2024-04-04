// ==UserScript==
// @name         Save_gitlab_reviewers
// @namespace    Gitlab Scripts
// @version      2024-04-03
// @description  Add buttons to save / load reviewers from Gitlab MRs
// @author       Rafael Caballero Mora
// @match        *://*/*/merge_requests/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gitlab.com
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    console.log("Script is running");

    //Adds buttons
    var reviewerInput = document.getElementsByName("merge_request[reviewer_ids][]")[0];
    var parentDiv = reviewerInput.parentMode;
    var dropdown = parentDiv.lastElementChild;
    parentDiv.style.display = "inline-flex";

    function removeAllCurrentReviewers(currentReviewers, form){
        if(!currentReviewers.length) currentReviewers = [currentReviewers];
        currentReviewers = [...currentReviewers]; //must copy for this to work
        currentReviewers.forEach((input)=>input.remove());
    }

    //Create Save button
    var buttonSave = document.createElement("a");
    buttonSave.classList.add("gl-button", "btn", "btn-md", "btn-confirm");
    buttonSave.style["margin-left"] = "10px";
    buttonSave.innerHTML = "<span class='gl-button-text'>Save reviewers</span>";

    buttonSave.onclick = function () {
        var form = document.getElementsByClassName("merge-request-form")[0];
        var selectedReviewers = form.elements["merge_request[reviewer_ids][]"];
        if (!selectedReviewers.length) selectedReviewers = [selectedReviewers];
        var reviewersToSave = [];
        selectedReviewers.forEach((input)=>reviewersToSave.push(input.outerHTML));
        GM_setValue("GITLAB-MR-reviewers", reviewersToSave);
        GM_setValue("GITLAB-MR-dropdown", dropdown.firstChild.firstChild.innerHTML);
    }

    //Create Load button
    var buttonLoad = document.createElement("a");
    buttonLoad.classList.add("gl-button", "btn", "btn-md", "btn-confirm");
    buttonLoad.style["margin-left"] = "10px";
    buttonLoad.innerHTML = "<span class='gl-button-text'>Load reviewers</span>";

    buttonLoad.onclick = function () {
        var savedReviewers = GM_getValue("GITLAB-MR-reviewers");
        var form = document.getElementsByClassName("merge-request-form")[0];
        var currentReviewers = form.elements["merge_request[reviewer_ids][]"];
        if (currentReviewers) removeAllCurrentReviewers(currentReviewers, form);

        for (const index in savedReviewers){
            var hiddenInput = document.createElement("input");
            parentDiv.prepend(hiddenInput);
            hiddenInput.outerHTML = savedReviewers[index];
        }
        dropdown.firstChild.firstChild.innerHTML = GM_getValue("GITLAB-MR-dropdown");
    }

    parentDiv.appendChild(buttonSave);
    parentDiv.appendChild(buttonLoad);

})();