{{- define "asset-service.name" -}}
{{- .Chart.Name | trunc 63 | trimSuffix "-" -}}
{{- end }}

{{- define "asset-service.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end }}

# Labels for asset-service
{{- define "asset-service.labels" -}}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version }}
app.kubernetes.io/name: {{ include "asset-service.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

# Selector Labels for asset-service
{{- define "asset-service.selectorLabels" -}}
app: asset-service
app.kubernetes.io/name: {{ include "asset-service.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

## redis-db


{{- define "redis-asset.name" -}}
redis-asset
{{- end }}

{{- define "redis-asset.fullname" -}}
redis-asset-service
{{- end }}

{{- define "redis-asset.labels" -}}
app: redis-asset
app.kubernetes.io/name: {{ include "redis-asset.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{- define "redis-asset.selectorLabels" -}}
app: redis-asset
{{- end }}
