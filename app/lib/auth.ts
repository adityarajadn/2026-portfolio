"use client";

export function setAuthCookie() {
  document.cookie = "auth_token=authenticated-admin; path=/; max-age=31536000; SameSite=Strict";
}

export function clearAuthCookie() {
  document.cookie = "auth_token=; path=/; max-age=0;";
}
