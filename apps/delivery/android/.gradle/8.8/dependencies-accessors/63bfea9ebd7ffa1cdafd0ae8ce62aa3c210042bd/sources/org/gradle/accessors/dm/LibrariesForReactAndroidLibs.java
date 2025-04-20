package org.gradle.accessors.dm;

import org.gradle.api.NonNullApi;
import org.gradle.api.artifacts.MinimalExternalModuleDependency;
import org.gradle.plugin.use.PluginDependency;
import org.gradle.api.artifacts.ExternalModuleDependencyBundle;
import org.gradle.api.artifacts.MutableVersionConstraint;
import org.gradle.api.provider.Provider;
import org.gradle.api.model.ObjectFactory;
import org.gradle.api.provider.ProviderFactory;
import org.gradle.api.internal.catalog.AbstractExternalDependencyFactory;
import org.gradle.api.internal.catalog.DefaultVersionCatalog;
import java.util.Map;
import org.gradle.api.internal.attributes.ImmutableAttributesFactory;
import org.gradle.api.internal.artifacts.dsl.CapabilityNotationParser;
import javax.inject.Inject;

/**
 * A catalog of dependencies accessible via the {@code reactAndroidLibs} extension.
 */
@NonNullApi
public class LibrariesForReactAndroidLibs extends AbstractExternalDependencyFactory {

    private final AbstractExternalDependencyFactory owner = this;
    private final AndroidxLibraryAccessors laccForAndroidxLibraryAccessors = new AndroidxLibraryAccessors(owner);
    private final FrescoLibraryAccessors laccForFrescoLibraryAccessors = new FrescoLibraryAccessors(owner);
    private final InferLibraryAccessors laccForInferLibraryAccessors = new InferLibraryAccessors(owner);
    private final JavaxLibraryAccessors laccForJavaxLibraryAccessors = new JavaxLibraryAccessors(owner);
    private final Okhttp3LibraryAccessors laccForOkhttp3LibraryAccessors = new Okhttp3LibraryAccessors(owner);
    private final YogaLibraryAccessors laccForYogaLibraryAccessors = new YogaLibraryAccessors(owner);
    private final VersionAccessors vaccForVersionAccessors = new VersionAccessors(providers, config);
    private final BundleAccessors baccForBundleAccessors = new BundleAccessors(objects, providers, config, attributesFactory, capabilityNotationParser);
    private final PluginAccessors paccForPluginAccessors = new PluginAccessors(providers, config);

    @Inject
    public LibrariesForReactAndroidLibs(DefaultVersionCatalog config, ProviderFactory providers, ObjectFactory objects, ImmutableAttributesFactory attributesFactory, CapabilityNotationParser capabilityNotationParser) {
        super(config, providers, objects, attributesFactory, capabilityNotationParser);
    }

    /**
     * Dependency provider for <b>assertj</b> with <b>org.assertj:assertj-core</b> coordinates and
     * with version reference <b>assertj</b>
     * <p>
     * This dependency was declared in catalog libs.versions.toml
     */
    public Provider<MinimalExternalModuleDependency> getAssertj() {
        return create("assertj");
    }

    /**
     * Dependency provider for <b>fbjni</b> with <b>com.facebook.fbjni:fbjni</b> coordinates and
     * with version reference <b>fbjni</b>
     * <p>
     * This dependency was declared in catalog libs.versions.toml
     */
    public Provider<MinimalExternalModuleDependency> getFbjni() {
        return create("fbjni");
    }

    /**
     * Dependency provider for <b>jsr305</b> with <b>com.google.code.findbugs:jsr305</b> coordinates and
     * with version reference <b>jsr305</b>
     * <p>
     * This dependency was declared in catalog libs.versions.toml
     */
    public Provider<MinimalExternalModuleDependency> getJsr305() {
        return create("jsr305");
    }

    /**
     * Dependency provider for <b>junit</b> with <b>junit:junit</b> coordinates and
     * with version reference <b>junit</b>
     * <p>
     * This dependency was declared in catalog libs.versions.toml
     */
    public Provider<MinimalExternalModuleDependency> getJunit() {
        return create("junit");
    }

    /**
     * Dependency provider for <b>mockito</b> with <b>org.mockito:mockito-inline</b> coordinates and
     * with version reference <b>mockito</b>
     * <p>
     * This dependency was declared in catalog libs.versions.toml
     */
    public Provider<MinimalExternalModuleDependency> getMockito() {
        return create("mockito");
    }

    /**
     * Dependency provider for <b>okio</b> with <b>com.squareup.okio:okio</b> coordinates and
     * with version reference <b>okio</b>
     * <p>
     * This dependency was declared in catalog libs.versions.toml
     */
    public Provider<MinimalExternalModuleDependency> getOkio() {
        return create("okio");
    }

    /**
     * Dependency provider for <b>robolectric</b> with <b>org.robolectric:robolectric</b> coordinates and
     * with version reference <b>robolectric</b>
     * <p>
     * This dependency was declared in catalog libs.versions.toml
     */
    public Provider<MinimalExternalModuleDependency> getRobolectric() {
        return create("robolectric");
    }

    /**
     * Dependency provider for <b>soloader</b> with <b>com.facebook.soloader:soloader</b> coordinates and
     * with version reference <b>soloader</b>
     * <p>
     * This dependency was declared in catalog libs.versions.toml
     */
    public Provider<MinimalExternalModuleDependency> getSoloader() {
        return create("soloader");
    }

    /**
     * Dependency provider for <b>thoughtworks</b> with <b>com.thoughtworks.xstream:xstream</b> coordinates and
     * with version reference <b>xstream</b>
     * <p>
     * This dependency was declared in catalog libs.versions.toml
     */
    public Provider<MinimalExternalModuleDependency> getThoughtworks() {
        return create("thoughtworks");
    }

    /**
     * Group of libraries at <b>androidx</b>
     */
    public AndroidxLibraryAccessors getAndroidx() {
        return laccForAndroidxLibraryAccessors;
    }

    /**
     * Group of libraries at <b>fresco</b>
     */
    public FrescoLibraryAccessors getFresco() {
        return laccForFrescoLibraryAccessors;
    }

    /**
     * Group of libraries at <b>infer</b>
     */
    public InferLibraryAccessors getInfer() {
        return laccForInferLibraryAccessors;
    }

    /**
     * Group of libraries at <b>javax</b>
     */
    public JavaxLibraryAccessors getJavax() {
        return laccForJavaxLibraryAccessors;
    }

    /**
     * Group of libraries at <b>okhttp3</b>
     */
    public Okhttp3LibraryAccessors getOkhttp3() {
        return laccForOkhttp3LibraryAccessors;
    }

    /**
     * Group of libraries at <b>yoga</b>
     */
    public YogaLibraryAccessors getYoga() {
        return laccForYogaLibraryAccessors;
    }

    /**
     * Group of versions at <b>versions</b>
     */
    public VersionAccessors getVersions() {
        return vaccForVersionAccessors;
    }

    /**
     * Group of bundles at <b>bundles</b>
     */
    public BundleAccessors getBundles() {
        return baccForBundleAccessors;
    }

    /**
     * Group of plugins at <b>plugins</b>
     */
    public PluginAccessors getPlugins() {
        return paccForPluginAccessors;
    }

    public static class AndroidxLibraryAccessors extends SubDependencyFactory {
        private final AndroidxAppcompatLibraryAccessors laccForAndroidxAppcompatLibraryAccessors = new AndroidxAppcompatLibraryAccessors(owner);
        private final AndroidxTestLibraryAccessors laccForAndroidxTestLibraryAccessors = new AndroidxTestLibraryAccessors(owner);

        public AndroidxLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

        /**
         * Dependency provider for <b>annotation</b> with <b>androidx.annotation:annotation</b> coordinates and
         * with version reference <b>androidx.annotation</b>
         * <p>
         * This dependency was declared in catalog libs.versions.toml
         */
        public Provider<MinimalExternalModuleDependency> getAnnotation() {
            return create("androidx.annotation");
        }

        /**
         * Dependency provider for <b>autofill</b> with <b>androidx.autofill:autofill</b> coordinates and
         * with version reference <b>androidx.autofill</b>
         * <p>
         * This dependency was declared in catalog libs.versions.toml
         */
        public Provider<MinimalExternalModuleDependency> getAutofill() {
            return create("androidx.autofill");
        }

        /**
         * Dependency provider for <b>swiperefreshlayout</b> with <b>androidx.swiperefreshlayout:swiperefreshlayout</b> coordinates and
         * with version reference <b>androidx.swiperefreshlayout</b>
         * <p>
         * This dependency was declared in catalog libs.versions.toml
         */
        public Provider<MinimalExternalModuleDependency> getSwiperefreshlayout() {
            return create("androidx.swiperefreshlayout");
        }

        /**
         * Dependency provider for <b>tracing</b> with <b>androidx.tracing:tracing</b> coordinates and
         * with version reference <b>androidx.tracing</b>
         * <p>
         * This dependency was declared in catalog libs.versions.toml
         */
        public Provider<MinimalExternalModuleDependency> getTracing() {
            return create("androidx.tracing");
        }

        /**
         * Group of libraries at <b>androidx.appcompat</b>
         */
        public AndroidxAppcompatLibraryAccessors getAppcompat() {
            return laccForAndroidxAppcompatLibraryAccessors;
        }

        /**
         * Group of libraries at <b>androidx.test</b>
         */
        public AndroidxTestLibraryAccessors getTest() {
            return laccForAndroidxTestLibraryAccessors;
        }

    }

    public static class AndroidxAppcompatLibraryAccessors extends SubDependencyFactory implements DependencyNotationSupplier {

        public AndroidxAppcompatLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

        /**
         * Dependency provider for <b>appcompat</b> with <b>androidx.appcompat:appcompat</b> coordinates and
         * with version reference <b>androidx.appcompat</b>
         * <p>
         * This dependency was declared in catalog libs.versions.toml
         */
        public Provider<MinimalExternalModuleDependency> asProvider() {
            return create("androidx.appcompat");
        }

        /**
         * Dependency provider for <b>resources</b> with <b>androidx.appcompat:appcompat-resources</b> coordinates and
         * with version reference <b>androidx.appcompat</b>
         * <p>
         * This dependency was declared in catalog libs.versions.toml
         */
        public Provider<MinimalExternalModuleDependency> getResources() {
            return create("androidx.appcompat.resources");
        }

    }

    public static class AndroidxTestLibraryAccessors extends SubDependencyFactory {

        public AndroidxTestLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

        /**
         * Dependency provider for <b>rules</b> with <b>androidx.test:rules</b> coordinates and
         * with version reference <b>androidx.test</b>
         * <p>
         * This dependency was declared in catalog libs.versions.toml
         */
        public Provider<MinimalExternalModuleDependency> getRules() {
            return create("androidx.test.rules");
        }

        /**
         * Dependency provider for <b>runner</b> with <b>androidx.test:runner</b> coordinates and
         * with version reference <b>androidx.test</b>
         * <p>
         * This dependency was declared in catalog libs.versions.toml
         */
        public Provider<MinimalExternalModuleDependency> getRunner() {
            return create("androidx.test.runner");
        }

    }

    public static class FrescoLibraryAccessors extends SubDependencyFactory implements DependencyNotationSupplier {
        private final FrescoImagepipelineLibraryAccessors laccForFrescoImagepipelineLibraryAccessors = new FrescoImagepipelineLibraryAccessors(owner);
        private final FrescoUiLibraryAccessors laccForFrescoUiLibraryAccessors = new FrescoUiLibraryAccessors(owner);

        public FrescoLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

        /**
         * Dependency provider for <b>fresco</b> with <b>com.facebook.fresco:fresco</b> coordinates and
         * with version reference <b>fresco</b>
         * <p>
         * This dependency was declared in catalog libs.versions.toml
         */
        public Provider<MinimalExternalModuleDependency> asProvider() {
            return create("fresco");
        }

        /**
         * Dependency provider for <b>middleware</b> with <b>com.facebook.fresco:middleware</b> coordinates and
         * with version reference <b>fresco</b>
         * <p>
         * This dependency was declared in catalog libs.versions.toml
         */
        public Provider<MinimalExternalModuleDependency> getMiddleware() {
            return create("fresco.middleware");
        }

        /**
         * Group of libraries at <b>fresco.imagepipeline</b>
         */
        public FrescoImagepipelineLibraryAccessors getImagepipeline() {
            return laccForFrescoImagepipelineLibraryAccessors;
        }

        /**
         * Group of libraries at <b>fresco.ui</b>
         */
        public FrescoUiLibraryAccessors getUi() {
            return laccForFrescoUiLibraryAccessors;
        }

    }

    public static class FrescoImagepipelineLibraryAccessors extends SubDependencyFactory {

        public FrescoImagepipelineLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

        /**
         * Dependency provider for <b>okhttp3</b> with <b>com.facebook.fresco:imagepipeline-okhttp3</b> coordinates and
         * with version reference <b>fresco</b>
         * <p>
         * This dependency was declared in catalog libs.versions.toml
         */
        public Provider<MinimalExternalModuleDependency> getOkhttp3() {
            return create("fresco.imagepipeline.okhttp3");
        }

    }

    public static class FrescoUiLibraryAccessors extends SubDependencyFactory {

        public FrescoUiLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

        /**
         * Dependency provider for <b>common</b> with <b>com.facebook.fresco:ui-common</b> coordinates and
         * with version reference <b>fresco</b>
         * <p>
         * This dependency was declared in catalog libs.versions.toml
         */
        public Provider<MinimalExternalModuleDependency> getCommon() {
            return create("fresco.ui.common");
        }

    }

    public static class InferLibraryAccessors extends SubDependencyFactory {

        public InferLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

        /**
         * Dependency provider for <b>annotation</b> with <b>com.facebook.infer.annotation:infer-annotation</b> coordinates and
         * with version reference <b>infer.annotation</b>
         * <p>
         * This dependency was declared in catalog libs.versions.toml
         */
        public Provider<MinimalExternalModuleDependency> getAnnotation() {
            return create("infer.annotation");
        }

    }

    public static class JavaxLibraryAccessors extends SubDependencyFactory {
        private final JavaxAnnotationLibraryAccessors laccForJavaxAnnotationLibraryAccessors = new JavaxAnnotationLibraryAccessors(owner);

        public JavaxLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

        /**
         * Dependency provider for <b>inject</b> with <b>javax.inject:javax.inject</b> coordinates and
         * with version reference <b>javax.inject</b>
         * <p>
         * This dependency was declared in catalog libs.versions.toml
         */
        public Provider<MinimalExternalModuleDependency> getInject() {
            return create("javax.inject");
        }

        /**
         * Group of libraries at <b>javax.annotation</b>
         */
        public JavaxAnnotationLibraryAccessors getAnnotation() {
            return laccForJavaxAnnotationLibraryAccessors;
        }

    }

    public static class JavaxAnnotationLibraryAccessors extends SubDependencyFactory {

        public JavaxAnnotationLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

        /**
         * Dependency provider for <b>api</b> with <b>javax.annotation:javax.annotation-api</b> coordinates and
         * with version reference <b>javax.annotation.api</b>
         * <p>
         * This dependency was declared in catalog libs.versions.toml
         */
        public Provider<MinimalExternalModuleDependency> getApi() {
            return create("javax.annotation.api");
        }

    }

    public static class Okhttp3LibraryAccessors extends SubDependencyFactory implements DependencyNotationSupplier {

        public Okhttp3LibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

        /**
         * Dependency provider for <b>okhttp3</b> with <b>com.squareup.okhttp3:okhttp</b> coordinates and
         * with version reference <b>okhttp</b>
         * <p>
         * This dependency was declared in catalog libs.versions.toml
         */
        public Provider<MinimalExternalModuleDependency> asProvider() {
            return create("okhttp3");
        }

        /**
         * Dependency provider for <b>urlconnection</b> with <b>com.squareup.okhttp3:okhttp-urlconnection</b> coordinates and
         * with version reference <b>okhttp</b>
         * <p>
         * This dependency was declared in catalog libs.versions.toml
         */
        public Provider<MinimalExternalModuleDependency> getUrlconnection() {
            return create("okhttp3.urlconnection");
        }

    }

    public static class YogaLibraryAccessors extends SubDependencyFactory {
        private final YogaProguardLibraryAccessors laccForYogaProguardLibraryAccessors = new YogaProguardLibraryAccessors(owner);

        public YogaLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

        /**
         * Group of libraries at <b>yoga.proguard</b>
         */
        public YogaProguardLibraryAccessors getProguard() {
            return laccForYogaProguardLibraryAccessors;
        }

    }

    public static class YogaProguardLibraryAccessors extends SubDependencyFactory {

        public YogaProguardLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

        /**
         * Dependency provider for <b>annotations</b> with <b>com.facebook.yoga:proguard-annotations</b> coordinates and
         * with version reference <b>yoga.proguard.annotations</b>
         * <p>
         * This dependency was declared in catalog libs.versions.toml
         */
        public Provider<MinimalExternalModuleDependency> getAnnotations() {
            return create("yoga.proguard.annotations");
        }

    }

    public static class VersionAccessors extends VersionFactory  {

        private final AndroidxVersionAccessors vaccForAndroidxVersionAccessors = new AndroidxVersionAccessors(providers, config);
        private final BinaryVersionAccessors vaccForBinaryVersionAccessors = new BinaryVersionAccessors(providers, config);
        private final InferVersionAccessors vaccForInferVersionAccessors = new InferVersionAccessors(providers, config);
        private final JavaxVersionAccessors vaccForJavaxVersionAccessors = new JavaxVersionAccessors(providers, config);
        private final NexusVersionAccessors vaccForNexusVersionAccessors = new NexusVersionAccessors(providers, config);
        private final YogaVersionAccessors vaccForYogaVersionAccessors = new YogaVersionAccessors(providers, config);
        public VersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

        /**
         * Version alias <b>agp</b> with value <b>8.2.1</b>
         * <p>
         * If the version is a rich version and cannot be represented as a
         * single version string, an empty string is returned.
         * <p>
         * This version was declared in catalog libs.versions.toml
         */
        public Provider<String> getAgp() { return getVersion("agp"); }

        /**
         * Version alias <b>assertj</b> with value <b>3.21.0</b>
         * <p>
         * If the version is a rich version and cannot be represented as a
         * single version string, an empty string is returned.
         * <p>
         * This version was declared in catalog libs.versions.toml
         */
        public Provider<String> getAssertj() { return getVersion("assertj"); }

        /**
         * Version alias <b>boost</b> with value <b>1_83_0</b>
         * <p>
         * If the version is a rich version and cannot be represented as a
         * single version string, an empty string is returned.
         * <p>
         * This version was declared in catalog libs.versions.toml
         */
        public Provider<String> getBoost() { return getVersion("boost"); }

        /**
         * Version alias <b>buildTools</b> with value <b>34.0.0</b>
         * <p>
         * If the version is a rich version and cannot be represented as a
         * single version string, an empty string is returned.
         * <p>
         * This version was declared in catalog libs.versions.toml
         */
        public Provider<String> getBuildTools() { return getVersion("buildTools"); }

        /**
         * Version alias <b>compileSdk</b> with value <b>34</b>
         * <p>
         * If the version is a rich version and cannot be represented as a
         * single version string, an empty string is returned.
         * <p>
         * This version was declared in catalog libs.versions.toml
         */
        public Provider<String> getCompileSdk() { return getVersion("compileSdk"); }

        /**
         * Version alias <b>doubleconversion</b> with value <b>1.1.6</b>
         * <p>
         * If the version is a rich version and cannot be represented as a
         * single version string, an empty string is returned.
         * <p>
         * This version was declared in catalog libs.versions.toml
         */
        public Provider<String> getDoubleconversion() { return getVersion("doubleconversion"); }

        /**
         * Version alias <b>download</b> with value <b>5.4.0</b>
         * <p>
         * If the version is a rich version and cannot be represented as a
         * single version string, an empty string is returned.
         * <p>
         * This version was declared in catalog libs.versions.toml
         */
        public Provider<String> getDownload() { return getVersion("download"); }

        /**
         * Version alias <b>fbjni</b> with value <b>0.6.0</b>
         * <p>
         * If the version is a rich version and cannot be represented as a
         * single version string, an empty string is returned.
         * <p>
         * This version was declared in catalog libs.versions.toml
         */
        public Provider<String> getFbjni() { return getVersion("fbjni"); }

        /**
         * Version alias <b>fmt</b> with value <b>9.1.0</b>
         * <p>
         * If the version is a rich version and cannot be represented as a
         * single version string, an empty string is returned.
         * <p>
         * This version was declared in catalog libs.versions.toml
         */
        public Provider<String> getFmt() { return getVersion("fmt"); }

        /**
         * Version alias <b>folly</b> with value <b>2024.01.01.00</b>
         * <p>
         * If the version is a rich version and cannot be represented as a
         * single version string, an empty string is returned.
         * <p>
         * This version was declared in catalog libs.versions.toml
         */
        public Provider<String> getFolly() { return getVersion("folly"); }

        /**
         * Version alias <b>fresco</b> with value <b>3.1.3</b>
         * <p>
         * If the version is a rich version and cannot be represented as a
         * single version string, an empty string is returned.
         * <p>
         * This version was declared in catalog libs.versions.toml
         */
        public Provider<String> getFresco() { return getVersion("fresco"); }

        /**
         * Version alias <b>glog</b> with value <b>0.3.5</b>
         * <p>
         * If the version is a rich version and cannot be represented as a
         * single version string, an empty string is returned.
         * <p>
         * This version was declared in catalog libs.versions.toml
         */
        public Provider<String> getGlog() { return getVersion("glog"); }

        /**
         * Version alias <b>gtest</b> with value <b>1.12.1</b>
         * <p>
         * If the version is a rich version and cannot be represented as a
         * single version string, an empty string is returned.
         * <p>
         * This version was declared in catalog libs.versions.toml
         */
        public Provider<String> getGtest() { return getVersion("gtest"); }

        /**
         * Version alias <b>jsr305</b> with value <b>3.0.2</b>
         * <p>
         * If the version is a rich version and cannot be represented as a
         * single version string, an empty string is returned.
         * <p>
         * This version was declared in catalog libs.versions.toml
         */
        public Provider<String> getJsr305() { return getVersion("jsr305"); }

        /**
         * Version alias <b>junit</b> with value <b>4.13.2</b>
         * <p>
         * If the version is a rich version and cannot be represented as a
         * single version string, an empty string is returned.
         * <p>
         * This version was declared in catalog libs.versions.toml
         */
        public Provider<String> getJunit() { return getVersion("junit"); }

        /**
         * Version alias <b>kotlin</b> with value <b>1.9.22</b>
         * <p>
         * If the version is a rich version and cannot be represented as a
         * single version string, an empty string is returned.
         * <p>
         * This version was declared in catalog libs.versions.toml
         */
        public Provider<String> getKotlin() { return getVersion("kotlin"); }

        /**
         * Version alias <b>minSdk</b> with value <b>23</b>
         * <p>
         * If the version is a rich version and cannot be represented as a
         * single version string, an empty string is returned.
         * <p>
         * This version was declared in catalog libs.versions.toml
         */
        public Provider<String> getMinSdk() { return getVersion("minSdk"); }

        /**
         * Version alias <b>mockito</b> with value <b>3.12.4</b>
         * <p>
         * If the version is a rich version and cannot be represented as a
         * single version string, an empty string is returned.
         * <p>
         * This version was declared in catalog libs.versions.toml
         */
        public Provider<String> getMockito() { return getVersion("mockito"); }

        /**
         * Version alias <b>ndkVersion</b> with value <b>26.1.10909125</b>
         * <p>
         * If the version is a rich version and cannot be represented as a
         * single version string, an empty string is returned.
         * <p>
         * This version was declared in catalog libs.versions.toml
         */
        public Provider<String> getNdkVersion() { return getVersion("ndkVersion"); }

        /**
         * Version alias <b>okhttp</b> with value <b>4.9.2</b>
         * <p>
         * If the version is a rich version and cannot be represented as a
         * single version string, an empty string is returned.
         * <p>
         * This version was declared in catalog libs.versions.toml
         */
        public Provider<String> getOkhttp() { return getVersion("okhttp"); }

        /**
         * Version alias <b>okio</b> with value <b>2.9.0</b>
         * <p>
         * If the version is a rich version and cannot be represented as a
         * single version string, an empty string is returned.
         * <p>
         * This version was declared in catalog libs.versions.toml
         */
        public Provider<String> getOkio() { return getVersion("okio"); }

        /**
         * Version alias <b>robolectric</b> with value <b>4.9.2</b>
         * <p>
         * If the version is a rich version and cannot be represented as a
         * single version string, an empty string is returned.
         * <p>
         * This version was declared in catalog libs.versions.toml
         */
        public Provider<String> getRobolectric() { return getVersion("robolectric"); }

        /**
         * Version alias <b>soloader</b> with value <b>0.10.5</b>
         * <p>
         * If the version is a rich version and cannot be represented as a
         * single version string, an empty string is returned.
         * <p>
         * This version was declared in catalog libs.versions.toml
         */
        public Provider<String> getSoloader() { return getVersion("soloader"); }

        /**
         * Version alias <b>targetSdk</b> with value <b>34</b>
         * <p>
         * If the version is a rich version and cannot be represented as a
         * single version string, an empty string is returned.
         * <p>
         * This version was declared in catalog libs.versions.toml
         */
        public Provider<String> getTargetSdk() { return getVersion("targetSdk"); }

        /**
         * Version alias <b>xstream</b> with value <b>1.4.20</b>
         * <p>
         * If the version is a rich version and cannot be represented as a
         * single version string, an empty string is returned.
         * <p>
         * This version was declared in catalog libs.versions.toml
         */
        public Provider<String> getXstream() { return getVersion("xstream"); }

        /**
         * Group of versions at <b>versions.androidx</b>
         */
        public AndroidxVersionAccessors getAndroidx() {
            return vaccForAndroidxVersionAccessors;
        }

        /**
         * Group of versions at <b>versions.binary</b>
         */
        public BinaryVersionAccessors getBinary() {
            return vaccForBinaryVersionAccessors;
        }

        /**
         * Group of versions at <b>versions.infer</b>
         */
        public InferVersionAccessors getInfer() {
            return vaccForInferVersionAccessors;
        }

        /**
         * Group of versions at <b>versions.javax</b>
         */
        public JavaxVersionAccessors getJavax() {
            return vaccForJavaxVersionAccessors;
        }

        /**
         * Group of versions at <b>versions.nexus</b>
         */
        public NexusVersionAccessors getNexus() {
            return vaccForNexusVersionAccessors;
        }

        /**
         * Group of versions at <b>versions.yoga</b>
         */
        public YogaVersionAccessors getYoga() {
            return vaccForYogaVersionAccessors;
        }

    }

    public static class AndroidxVersionAccessors extends VersionFactory  {

        public AndroidxVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

        /**
         * Version alias <b>androidx.annotation</b> with value <b>1.6.0</b>
         * <p>
         * If the version is a rich version and cannot be represented as a
         * single version string, an empty string is returned.
         * <p>
         * This version was declared in catalog libs.versions.toml
         */
        public Provider<String> getAnnotation() { return getVersion("androidx.annotation"); }

        /**
         * Version alias <b>androidx.appcompat</b> with value <b>1.6.1</b>
         * <p>
         * If the version is a rich version and cannot be represented as a
         * single version string, an empty string is returned.
         * <p>
         * This version was declared in catalog libs.versions.toml
         */
        public Provider<String> getAppcompat() { return getVersion("androidx.appcompat"); }

        /**
         * Version alias <b>androidx.autofill</b> with value <b>1.1.0</b>
         * <p>
         * If the version is a rich version and cannot be represented as a
         * single version string, an empty string is returned.
         * <p>
         * This version was declared in catalog libs.versions.toml
         */
        public Provider<String> getAutofill() { return getVersion("androidx.autofill"); }

        /**
         * Version alias <b>androidx.swiperefreshlayout</b> with value <b>1.1.0</b>
         * <p>
         * If the version is a rich version and cannot be represented as a
         * single version string, an empty string is returned.
         * <p>
         * This version was declared in catalog libs.versions.toml
         */
        public Provider<String> getSwiperefreshlayout() { return getVersion("androidx.swiperefreshlayout"); }

        /**
         * Version alias <b>androidx.test</b> with value <b>1.5.0</b>
         * <p>
         * If the version is a rich version and cannot be represented as a
         * single version string, an empty string is returned.
         * <p>
         * This version was declared in catalog libs.versions.toml
         */
        public Provider<String> getTest() { return getVersion("androidx.test"); }

        /**
         * Version alias <b>androidx.tracing</b> with value <b>1.1.0</b>
         * <p>
         * If the version is a rich version and cannot be represented as a
         * single version string, an empty string is returned.
         * <p>
         * This version was declared in catalog libs.versions.toml
         */
        public Provider<String> getTracing() { return getVersion("androidx.tracing"); }

    }

    public static class BinaryVersionAccessors extends VersionFactory  {

        private final BinaryCompatibilityVersionAccessors vaccForBinaryCompatibilityVersionAccessors = new BinaryCompatibilityVersionAccessors(providers, config);
        public BinaryVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

        /**
         * Group of versions at <b>versions.binary.compatibility</b>
         */
        public BinaryCompatibilityVersionAccessors getCompatibility() {
            return vaccForBinaryCompatibilityVersionAccessors;
        }

    }

    public static class BinaryCompatibilityVersionAccessors extends VersionFactory  {

        public BinaryCompatibilityVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

        /**
         * Version alias <b>binary.compatibility.validator</b> with value <b>0.13.2</b>
         * <p>
         * If the version is a rich version and cannot be represented as a
         * single version string, an empty string is returned.
         * <p>
         * This version was declared in catalog libs.versions.toml
         */
        public Provider<String> getValidator() { return getVersion("binary.compatibility.validator"); }

    }

    public static class InferVersionAccessors extends VersionFactory  {

        public InferVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

        /**
         * Version alias <b>infer.annotation</b> with value <b>0.18.0</b>
         * <p>
         * If the version is a rich version and cannot be represented as a
         * single version string, an empty string is returned.
         * <p>
         * This version was declared in catalog libs.versions.toml
         */
        public Provider<String> getAnnotation() { return getVersion("infer.annotation"); }

    }

    public static class JavaxVersionAccessors extends VersionFactory  {

        private final JavaxAnnotationVersionAccessors vaccForJavaxAnnotationVersionAccessors = new JavaxAnnotationVersionAccessors(providers, config);
        public JavaxVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

        /**
         * Version alias <b>javax.inject</b> with value <b>1</b>
         * <p>
         * If the version is a rich version and cannot be represented as a
         * single version string, an empty string is returned.
         * <p>
         * This version was declared in catalog libs.versions.toml
         */
        public Provider<String> getInject() { return getVersion("javax.inject"); }

        /**
         * Group of versions at <b>versions.javax.annotation</b>
         */
        public JavaxAnnotationVersionAccessors getAnnotation() {
            return vaccForJavaxAnnotationVersionAccessors;
        }

    }

    public static class JavaxAnnotationVersionAccessors extends VersionFactory  {

        public JavaxAnnotationVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

        /**
         * Version alias <b>javax.annotation.api</b> with value <b>1.3.2</b>
         * <p>
         * If the version is a rich version and cannot be represented as a
         * single version string, an empty string is returned.
         * <p>
         * This version was declared in catalog libs.versions.toml
         */
        public Provider<String> getApi() { return getVersion("javax.annotation.api"); }

    }

    public static class NexusVersionAccessors extends VersionFactory  {

        public NexusVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

        /**
         * Version alias <b>nexus.publish</b> with value <b>1.3.0</b>
         * <p>
         * If the version is a rich version and cannot be represented as a
         * single version string, an empty string is returned.
         * <p>
         * This version was declared in catalog libs.versions.toml
         */
        public Provider<String> getPublish() { return getVersion("nexus.publish"); }

    }

    public static class YogaVersionAccessors extends VersionFactory  {

        private final YogaProguardVersionAccessors vaccForYogaProguardVersionAccessors = new YogaProguardVersionAccessors(providers, config);
        public YogaVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

        /**
         * Group of versions at <b>versions.yoga.proguard</b>
         */
        public YogaProguardVersionAccessors getProguard() {
            return vaccForYogaProguardVersionAccessors;
        }

    }

    public static class YogaProguardVersionAccessors extends VersionFactory  {

        public YogaProguardVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

        /**
         * Version alias <b>yoga.proguard.annotations</b> with value <b>1.19.0</b>
         * <p>
         * If the version is a rich version and cannot be represented as a
         * single version string, an empty string is returned.
         * <p>
         * This version was declared in catalog libs.versions.toml
         */
        public Provider<String> getAnnotations() { return getVersion("yoga.proguard.annotations"); }

    }

    public static class BundleAccessors extends BundleFactory {

        public BundleAccessors(ObjectFactory objects, ProviderFactory providers, DefaultVersionCatalog config, ImmutableAttributesFactory attributesFactory, CapabilityNotationParser capabilityNotationParser) { super(objects, providers, config, attributesFactory, capabilityNotationParser); }

    }

    public static class PluginAccessors extends PluginFactory {
        private final AndroidPluginAccessors paccForAndroidPluginAccessors = new AndroidPluginAccessors(providers, config);
        private final BinaryPluginAccessors paccForBinaryPluginAccessors = new BinaryPluginAccessors(providers, config);
        private final KotlinPluginAccessors paccForKotlinPluginAccessors = new KotlinPluginAccessors(providers, config);
        private final NexusPluginAccessors paccForNexusPluginAccessors = new NexusPluginAccessors(providers, config);

        public PluginAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

        /**
         * Plugin provider for <b>download</b> with plugin id <b>de.undercouch.download</b> and
         * with version reference <b>download</b>
         * <p>
         * This plugin was declared in catalog libs.versions.toml
         */
        public Provider<PluginDependency> getDownload() { return createPlugin("download"); }

        /**
         * Group of plugins at <b>plugins.android</b>
         */
        public AndroidPluginAccessors getAndroid() {
            return paccForAndroidPluginAccessors;
        }

        /**
         * Group of plugins at <b>plugins.binary</b>
         */
        public BinaryPluginAccessors getBinary() {
            return paccForBinaryPluginAccessors;
        }

        /**
         * Group of plugins at <b>plugins.kotlin</b>
         */
        public KotlinPluginAccessors getKotlin() {
            return paccForKotlinPluginAccessors;
        }

        /**
         * Group of plugins at <b>plugins.nexus</b>
         */
        public NexusPluginAccessors getNexus() {
            return paccForNexusPluginAccessors;
        }

    }

    public static class AndroidPluginAccessors extends PluginFactory {

        public AndroidPluginAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

        /**
         * Plugin provider for <b>android.application</b> with plugin id <b>com.android.application</b> and
         * with version reference <b>agp</b>
         * <p>
         * This plugin was declared in catalog libs.versions.toml
         */
        public Provider<PluginDependency> getApplication() { return createPlugin("android.application"); }

        /**
         * Plugin provider for <b>android.library</b> with plugin id <b>com.android.library</b> and
         * with version reference <b>agp</b>
         * <p>
         * This plugin was declared in catalog libs.versions.toml
         */
        public Provider<PluginDependency> getLibrary() { return createPlugin("android.library"); }

    }

    public static class BinaryPluginAccessors extends PluginFactory {
        private final BinaryCompatibilityPluginAccessors paccForBinaryCompatibilityPluginAccessors = new BinaryCompatibilityPluginAccessors(providers, config);

        public BinaryPluginAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

        /**
         * Group of plugins at <b>plugins.binary.compatibility</b>
         */
        public BinaryCompatibilityPluginAccessors getCompatibility() {
            return paccForBinaryCompatibilityPluginAccessors;
        }

    }

    public static class BinaryCompatibilityPluginAccessors extends PluginFactory {

        public BinaryCompatibilityPluginAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

        /**
         * Plugin provider for <b>binary.compatibility.validator</b> with plugin id <b>org.jetbrains.kotlinx.binary-compatibility-validator</b> and
         * with version reference <b>binary.compatibility.validator</b>
         * <p>
         * This plugin was declared in catalog libs.versions.toml
         */
        public Provider<PluginDependency> getValidator() { return createPlugin("binary.compatibility.validator"); }

    }

    public static class KotlinPluginAccessors extends PluginFactory {

        public KotlinPluginAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

        /**
         * Plugin provider for <b>kotlin.android</b> with plugin id <b>org.jetbrains.kotlin.android</b> and
         * with version reference <b>kotlin</b>
         * <p>
         * This plugin was declared in catalog libs.versions.toml
         */
        public Provider<PluginDependency> getAndroid() { return createPlugin("kotlin.android"); }

    }

    public static class NexusPluginAccessors extends PluginFactory {

        public NexusPluginAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

        /**
         * Plugin provider for <b>nexus.publish</b> with plugin id <b>io.github.gradle-nexus.publish-plugin</b> and
         * with version reference <b>nexus.publish</b>
         * <p>
         * This plugin was declared in catalog libs.versions.toml
         */
        public Provider<PluginDependency> getPublish() { return createPlugin("nexus.publish"); }

    }

}
