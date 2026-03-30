
{{- /* Chart name */ -}}
{{- define "incident-service.name" -}}
{{- .Chart.Name | trunc 63 | trimSuffix "-" -}}
{{- end }}

{{- /* Full name */ -}}
{{- define "incident-service.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end }}

{{- /* Labels */ -}}
{{- define "incident-service.labels" -}}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version }}
app.kubernetes.io/name: {{ include "incident-service.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{- /* Selector Labels */ -}}
{{- define "incident-service.selectorLabels" -}}
app: incident-service
app.kubernetes.io/name: {{ include "incident-service.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{- define "redis-incident.name" -}}
redis-incident
{{- end }}

{{- define "redis-incident.fullname" -}}
redis-incident-service
{{- end }}

{{- define "redis-incident.labels" -}}
app: redis-incident
app.kubernetes.io/name: {{ include "redis-incident.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{- define "redis-incident.selectorLabels" -}}
app: redis-incident
{{- end }}
