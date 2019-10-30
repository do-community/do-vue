<!--
Copyright 2019 DigitalOcean

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

<template>
    <div class="landing">
        <div class="background-top" v-html="this.$props.backgroundTop"></div>
        <div class="background-bottom" v-html="this.$props.backgroundBottom"></div>
        <div class="container">
            <h1>{{ this.$props.title }}</h1>
            <p v-html="this.$props.description"></p>

            <slot></slot>

            <ExternalLink
                class="github-link"
                :text="i18n.templates.landing.github"
                :link="this.$props.github"
            ></ExternalLink>
        </div>
    </div>
</template>

<script>
    import i18n from '../i18n';
    import ExternalLink from './external_link';

    export default {
        name: 'Landing',
        components: {
            ExternalLink,
        },
        props: {
            backgroundTop: String,
            backgroundBottom: String,
            title: String,
            description: String,
            github: String,
        },
        data() {
            return {
                i18n,
            };
        },
    };
</script>
